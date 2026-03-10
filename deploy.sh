#!/usr/bin/env bash
set -euo pipefail

# =========================================================================
# CloudNature — Cloud Run デプロイスクリプト
# Usage: ./deploy.sh
# =========================================================================

# ---------------------------------------------------------------------------
# GCP 設定
# ---------------------------------------------------------------------------
GCP_PROJECT="${GCP_PROJECT:-video-gen-demo}"
GCP_REGION="${GCP_REGION:-asia-northeast1}"
SERVICE_NAME="${SERVICE_NAME:-backend}"
SCHEDULER_JOB_NAME="${SCHEDULER_JOB_NAME:-weekly-report}"
SCHEDULER_SCHEDULE="${SCHEDULER_SCHEDULE:-0 10 * * 1}"  # 毎週月曜 10:00 JST
SCHEDULER_TIMEZONE="${SCHEDULER_TIMEZONE:-Asia/Tokyo}"
IMAGE_REPO="${IMAGE_REPO:-${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT}/cloudnature/${SERVICE_NAME}}"
IMAGE_TAG="${IMAGE_TAG:-$(git -C backend rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)}"
BACKEND_DIR="${BACKEND_DIR:-backend}"

# ---------------------------------------------------------------------------
# 環境変数（プレーンテキスト）
# ※ 本番デプロイ用のデフォルト値。ローカル .env の値が混入しないよう直接定義する。
#    環境変数で上書き可能（例: FRONTEND_URL=... ./deploy.sh）
# ---------------------------------------------------------------------------
LLM_PROVIDER="${LLM_PROVIDER:-gemini}"
OPENAI_MODEL="${OPENAI_MODEL:-gpt-4.1-nano}"
GEMINI_MODEL="${GEMINI_MODEL:-gemini-2.5-flash}"
LLM_MAX_RETRIES="${LLM_MAX_RETRIES:-3}"
LLM_TIMEOUT="${LLM_TIMEOUT:-30}"
FRONTEND_URL="${FRONTEND_URL:-https://ai.cloudnature.jp}"
CORS_ORIGINS="${CORS_ORIGINS:-https://ai.cloudnature.jp}"
DATA_TTL_DAYS="${DATA_TTL_DAYS:-31}"
EMAIL_FROM="${EMAIL_FROM:-CloudNature <cloudnature@stage-site.net>}"
NOTIFY_EMAIL="${NOTIFY_EMAIL:-info@cloudnature.jp}"
NOTION_DATABASE_ID="${NOTION_DATABASE_ID:-310f32ffde8d8087a5d5e9e2cee4cb3f}"
GSC_SITE_URL="${GSC_SITE_URL:-sc-domain:cloudnature.jp}"
GA4_PROPERTY_ID="${GA4_PROPERTY_ID:-properties/527141612}"
REPORT_EMAIL="${REPORT_EMAIL:-info@cloudnature.jp}"

# ---------------------------------------------------------------------------
# シークレット（Secret Manager 参照名）
# ---------------------------------------------------------------------------
SECRET_API_KEY="${SECRET_API_KEY:-api-key}"
SECRET_OPENAI_API_KEY="${SECRET_OPENAI_API_KEY:-openai-api-key}"
SECRET_RESEND_API_KEY="${SECRET_RESEND_API_KEY:-resend-api-key}"
SECRET_DATABASE_URL="${SECRET_DATABASE_URL:-database-url}"
SECRET_NOTION_API_KEY="${SECRET_NOTION_API_KEY:-notion-api-key}"
SECRET_GEMINI_API_KEY="${SECRET_GEMINI_API_KEY:-gemini-api-key}"

# ---------------------------------------------------------------------------
# 事前チェック
# ---------------------------------------------------------------------------
if ! command -v gcloud &>/dev/null; then
  echo "❌ gcloud CLI が見つかりません" >&2
  exit 1
fi

if [ ! -f "${BACKEND_DIR}/Dockerfile" ]; then
  echo "❌ ${BACKEND_DIR}/Dockerfile が見つかりません" >&2
  exit 1
fi

echo "=========================================="
echo "  CloudNature Backend Deploy"
echo "=========================================="
echo "  Project:  ${GCP_PROJECT}"
echo "  Region:   ${GCP_REGION}"
echo "  Service:  ${SERVICE_NAME}"
echo "  Image:    ${IMAGE_REPO}:${IMAGE_TAG}"
echo "=========================================="
echo ""

# ---------------------------------------------------------------------------
# 1. Cloud Build でイメージをビルド＆プッシュ
# ---------------------------------------------------------------------------
echo "🔨 イメージをビルド中..."
gcloud builds submit "${BACKEND_DIR}" \
  --tag "${IMAGE_REPO}:${IMAGE_TAG}" \
  --project "${GCP_PROJECT}" \
  --quiet

echo "✅ ビルド完了: ${IMAGE_REPO}:${IMAGE_TAG}"
echo ""

# ---------------------------------------------------------------------------
# 2. Cloud Run にデプロイ（ダイジェスト指定で確実に反映）
# ---------------------------------------------------------------------------
echo "🚀 Cloud Run にデプロイ中..."
DIGEST=$(gcloud artifacts docker images describe \
  "${IMAGE_REPO}:${IMAGE_TAG}" \
  --project "${GCP_PROJECT}" \
  --format="value(image_summary.digest)" 2>/dev/null)

if [ -z "${DIGEST}" ]; then
  echo "❌ イメージダイジェストの取得に失敗しました" >&2
  exit 1
fi

gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_REPO}@${DIGEST}" \
  --project "${GCP_PROJECT}" \
  --region "${GCP_REGION}" \
  --set-env-vars "\
LLM_PROVIDER=${LLM_PROVIDER},\
OPENAI_MODEL=${OPENAI_MODEL},\
GEMINI_MODEL=${GEMINI_MODEL},\
LLM_MAX_RETRIES=${LLM_MAX_RETRIES},\
LLM_TIMEOUT=${LLM_TIMEOUT},\
FRONTEND_URL=${FRONTEND_URL},\
CORS_ORIGINS=${CORS_ORIGINS},\
DATA_TTL_DAYS=${DATA_TTL_DAYS},\
NOTIFY_EMAIL=${NOTIFY_EMAIL},\
NOTION_DATABASE_ID=${NOTION_DATABASE_ID},\
GSC_SITE_URL=${GSC_SITE_URL},\
GA4_PROPERTY_ID=${GA4_PROPERTY_ID},\
REPORT_EMAIL=${REPORT_EMAIL}" \
  --set-env-vars "EMAIL_FROM=${EMAIL_FROM}" \
  --set-secrets "\
API_KEY=${SECRET_API_KEY}:latest,\
OPENAI_API_KEY=${SECRET_OPENAI_API_KEY}:latest,\
RESEND_API_KEY=${SECRET_RESEND_API_KEY}:latest,\
DATABASE_URL=${SECRET_DATABASE_URL}:latest,\
NOTION_API_KEY=${SECRET_NOTION_API_KEY}:latest,\
GEMINI_API_KEY=${SECRET_GEMINI_API_KEY}:latest" \
  --quiet

echo ""
echo "✅ デプロイ完了!"
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --project "${GCP_PROJECT}" \
  --region "${GCP_REGION}" \
  --format="value(status.url)" 2>/dev/null)
echo "  URL: ${SERVICE_URL}"

# ---------------------------------------------------------------------------
# 3. Cloud Scheduler ジョブ（週次レポート）
# ---------------------------------------------------------------------------
echo ""
echo "⏰ Cloud Scheduler ジョブを設定中..."

# Scheduler 用サービスアカウント（Cloud Run invoker 権限）
SCHEDULER_SA="scheduler-invoker@${GCP_PROJECT}.iam.gserviceaccount.com"

# サービスアカウントが存在しなければ作成
if ! gcloud iam service-accounts describe "${SCHEDULER_SA}" \
  --project "${GCP_PROJECT}" &>/dev/null; then
  echo "  サービスアカウントを作成: ${SCHEDULER_SA}"
  gcloud iam service-accounts create scheduler-invoker \
    --display-name="Cloud Scheduler → Cloud Run invoker" \
    --project "${GCP_PROJECT}" \
    --quiet

  # Cloud Run の呼び出し権限を付与
  gcloud run services add-iam-policy-binding "${SERVICE_NAME}" \
    --member="serviceAccount:${SCHEDULER_SA}" \
    --role="roles/run.invoker" \
    --project "${GCP_PROJECT}" \
    --region "${GCP_REGION}" \
    --quiet
  echo "  ✅ サービスアカウント作成・権限付与完了"
fi

# ジョブを作成 or 更新
REPORT_ENDPOINT="${SERVICE_URL}/api/v1/reports/weekly"
if gcloud scheduler jobs describe "${SCHEDULER_JOB_NAME}" \
  --project "${GCP_PROJECT}" \
  --location "${GCP_REGION}" &>/dev/null; then
  # 既存ジョブを更新
  gcloud scheduler jobs update http "${SCHEDULER_JOB_NAME}" \
    --project "${GCP_PROJECT}" \
    --location "${GCP_REGION}" \
    --schedule "${SCHEDULER_SCHEDULE}" \
    --time-zone "${SCHEDULER_TIMEZONE}" \
    --uri "${REPORT_ENDPOINT}" \
    --http-method POST \
    --oidc-service-account-email "${SCHEDULER_SA}" \
    --oidc-token-audience "${SERVICE_URL}" \
    --attempt-deadline 300s \
    --quiet
  echo "  ✅ Scheduler ジョブを更新: ${SCHEDULER_JOB_NAME}"
else
  # 新規作成
  gcloud scheduler jobs create http "${SCHEDULER_JOB_NAME}" \
    --project "${GCP_PROJECT}" \
    --location "${GCP_REGION}" \
    --schedule "${SCHEDULER_SCHEDULE}" \
    --time-zone "${SCHEDULER_TIMEZONE}" \
    --uri "${REPORT_ENDPOINT}" \
    --http-method POST \
    --oidc-service-account-email "${SCHEDULER_SA}" \
    --oidc-token-audience "${SERVICE_URL}" \
    --attempt-deadline 300s \
    --quiet
  echo "  ✅ Scheduler ジョブを作成: ${SCHEDULER_JOB_NAME}"
fi
echo "  スケジュール: ${SCHEDULER_SCHEDULE} (${SCHEDULER_TIMEZONE})"
echo "  エンドポイント: ${REPORT_ENDPOINT}"

