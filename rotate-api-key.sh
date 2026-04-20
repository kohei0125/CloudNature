#!/usr/bin/env bash
set -euo pipefail

# =========================================================================
# CloudNature — BACKEND_API_KEY ローテーションスクリプト
#
# GCP Secret Manager のキーを再生成し、Cloud Run と Vercel の両方に反映する。
# Usage: ./rotate-api-key.sh
# =========================================================================

# ---------------------------------------------------------------------------
# 設定
# ---------------------------------------------------------------------------
GCP_PROJECT="${GCP_PROJECT:-video-gen-demo}"
GCP_REGION="${GCP_REGION:-asia-northeast1}"
SERVICE_NAME="${SERVICE_NAME:-backend}"
SECRET_NAME="${SECRET_NAME:-api-key}"

# Vercel プロジェクト（estimate サイト）
# vercel env rm / env add で使うプロジェクト名。
# Vercel CLI がリンク済みでない場合は --scope / --token を追加してください。
VERCEL_PROJECT="${VERCEL_PROJECT:-estimate}"

# ---------------------------------------------------------------------------
# 事前チェック
# ---------------------------------------------------------------------------
for cmd in gcloud openssl vercel; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "❌ ${cmd} が見つかりません。インストールしてください。" >&2
    exit 1
  fi
done

echo "=========================================="
echo "  BACKEND_API_KEY ローテーション"
echo "=========================================="
echo "  GCP Project : ${GCP_PROJECT}"
echo "  Cloud Run   : ${SERVICE_NAME} (${GCP_REGION})"
echo "  Secret      : ${SECRET_NAME}"
echo "  Vercel      : ${VERCEL_PROJECT}"
echo "=========================================="
echo ""

# ---------------------------------------------------------------------------
# 1. 新しいキーを生成
# ---------------------------------------------------------------------------
NEW_KEY=$(openssl rand -base64 32)
echo "🔑 新しいキーを生成しました"

# ---------------------------------------------------------------------------
# 2. GCP Secret Manager に新バージョンを追加
# ---------------------------------------------------------------------------
echo "☁️  Secret Manager に新バージョンを追加中..."
echo -n "${NEW_KEY}" | gcloud secrets versions add "${SECRET_NAME}" \
  --project "${GCP_PROJECT}" \
  --data-file=-

NEW_VERSION=$(gcloud secrets versions list "${SECRET_NAME}" \
  --project "${GCP_PROJECT}" \
  --sort-by="~createTime" \
  --limit=1 \
  --format="value(name)")
echo "  ✅ バージョン ${NEW_VERSION} を作成"

# ---------------------------------------------------------------------------
# 3. Cloud Run に新しいシークレットを反映（新リビジョン作成）
#    ※ --set-secrets は指定したもので全シークレットを置き換えるため、
#      対象外のシークレットも含めてすべて列挙する必要がある。
# ---------------------------------------------------------------------------
SECRET_OPENAI_API_KEY="${SECRET_OPENAI_API_KEY:-openai-api-key}"
SECRET_RESEND_API_KEY="${SECRET_RESEND_API_KEY:-resend-api-key}"
SECRET_DATABASE_URL="${SECRET_DATABASE_URL:-database-url}"
SECRET_NOTION_API_KEY="${SECRET_NOTION_API_KEY:-notion-api-key}"
SECRET_GEMINI_API_KEY="${SECRET_GEMINI_API_KEY:-gemini-api-key}"

echo "🚀 Cloud Run を更新中..."
gcloud run services update "${SERVICE_NAME}" \
  --project "${GCP_PROJECT}" \
  --region "${GCP_REGION}" \
  --set-secrets "\
API_KEY=${SECRET_NAME}:latest,\
OPENAI_API_KEY=${SECRET_OPENAI_API_KEY}:latest,\
RESEND_API_KEY=${SECRET_RESEND_API_KEY}:latest,\
DATABASE_URL=${SECRET_DATABASE_URL}:latest,\
NOTION_API_KEY=${SECRET_NOTION_API_KEY}:latest,\
GEMINI_API_KEY=${SECRET_GEMINI_API_KEY}:latest" \
  --quiet
echo "  ✅ Cloud Run 更新完了"

# ---------------------------------------------------------------------------
# 4. Vercel の環境変数を更新
# ---------------------------------------------------------------------------
echo "▲  Vercel の BACKEND_API_KEY を更新中..."

# 既存の変数を削除（production / preview / development すべて）
for env in production preview development; do
  vercel env rm BACKEND_API_KEY "${env}" --yes 2>/dev/null || true
done

# 新しい値を設定（production / preview / development すべて）
for env in production preview development; do
  echo -n "${NEW_KEY}" | vercel env add BACKEND_API_KEY "${env}"
done
echo "  ✅ Vercel 環境変数を更新"

# ---------------------------------------------------------------------------
# 5. Vercel を再デプロイ（本番に反映）
# ---------------------------------------------------------------------------
echo "▲  Vercel を再デプロイ中..."
vercel --prod --yes
echo "  ✅ Vercel 再デプロイ完了"

# ---------------------------------------------------------------------------
# 6. 旧バージョンを無効化
# ---------------------------------------------------------------------------
echo "🔒 旧シークレットバージョンを無効化中..."
ALL_ENABLED=$(gcloud secrets versions list "${SECRET_NAME}" \
  --project "${GCP_PROJECT}" \
  --filter="state=ENABLED" \
  --format="value(name)")

DISABLED_COUNT=0
for ver in ${ALL_ENABLED}; do
  # 新しく作成したバージョンはスキップ
  if [ "${ver}" = "${NEW_VERSION}" ]; then
    continue
  fi
  gcloud secrets versions disable "${ver}" \
    --secret "${SECRET_NAME}" \
    --project "${GCP_PROJECT}" \
    --quiet
  echo "  ✅ バージョン ${ver} を無効化"
  DISABLED_COUNT=$((DISABLED_COUNT + 1))
done

if [ "${DISABLED_COUNT}" -eq 0 ]; then
  echo "  (無効化対象の旧バージョンなし)"
fi

# ---------------------------------------------------------------------------
# 完了
# ---------------------------------------------------------------------------
echo ""
echo "=========================================="
echo "  ✅ ローテーション完了"
echo "=========================================="
echo "  新しいキーは Secret Manager バージョン ${NEW_VERSION} に保存されています。"
echo "  ※ キーの値はログに出力していません。"
echo "  ※ 確認: gcloud secrets versions access ${NEW_VERSION} --secret ${SECRET_NAME} --project ${GCP_PROJECT}"
echo ""
