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
IMAGE_REPO="${IMAGE_REPO:-${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT}/cloudnature/${SERVICE_NAME}}"
IMAGE_TAG="${IMAGE_TAG:-$(git -C backend rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M%S)}"
BACKEND_DIR="${BACKEND_DIR:-backend}"

# ---------------------------------------------------------------------------
# 環境変数（プレーンテキスト）
# ---------------------------------------------------------------------------
OPENAI_MODEL="${OPENAI_MODEL:-gpt-4o}"
LLM_MAX_RETRIES="${LLM_MAX_RETRIES:-3}"
LLM_TIMEOUT="${LLM_TIMEOUT:-30}"
FRONTEND_URL="${FRONTEND_URL:-https://ai.cloudnature.jp}"
CORS_ORIGINS="${CORS_ORIGINS:-https://ai.cloudnature.jp}"
DATA_TTL_DAYS="${DATA_TTL_DAYS:-31}"
EMAIL_FROM="${EMAIL_FROM:-CloudNature <cloudnature@stage-site.net>}"
NOTIFY_EMAIL="${NOTIFY_EMAIL:-k.watanabe.sys.contact@gmail.com}"

# ---------------------------------------------------------------------------
# シークレット（Secret Manager 参照名）
# ---------------------------------------------------------------------------
SECRET_API_KEY="${SECRET_API_KEY:-api-key}"
SECRET_OPENAI_API_KEY="${SECRET_OPENAI_API_KEY:-openai-api-key}"
SECRET_RESEND_API_KEY="${SECRET_RESEND_API_KEY:-resend-api-key}"
SECRET_DATABASE_URL="${SECRET_DATABASE_URL:-database-url}"

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
OPENAI_MODEL=${OPENAI_MODEL},\
LLM_MAX_RETRIES=${LLM_MAX_RETRIES},\
LLM_TIMEOUT=${LLM_TIMEOUT},\
FRONTEND_URL=${FRONTEND_URL},\
CORS_ORIGINS=${CORS_ORIGINS},\
DATA_TTL_DAYS=${DATA_TTL_DAYS},\
NOTIFY_EMAIL=${NOTIFY_EMAIL}" \
  --set-env-vars "EMAIL_FROM=${EMAIL_FROM}" \
  --set-secrets "\
API_KEY=${SECRET_API_KEY}:latest,\
OPENAI_API_KEY=${SECRET_OPENAI_API_KEY}:latest,\
RESEND_API_KEY=${SECRET_RESEND_API_KEY}:latest,\
DATABASE_URL=${SECRET_DATABASE_URL}:latest" \
  --quiet

echo ""
echo "✅ デプロイ完了!"
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --project "${GCP_PROJECT}" \
  --region "${GCP_REGION}" \
  --format="value(status.url)" 2>/dev/null)
echo "  URL: ${SERVICE_URL}"
