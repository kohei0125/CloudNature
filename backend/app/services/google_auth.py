"""Google API認証共通モジュール。

Cloud Run: ADC（Application Default Credentials）
ローカル: JSONキーファイルフォールバック
"""

import logging

from google.auth import default as google_auth_default
from google.oauth2 import service_account

from app.config import settings

logger = logging.getLogger(__name__)


def get_credentials(scopes: list[str]):
    """Google API認証情報を取得する。"""
    if settings.google_service_account_json:
        logger.info("Using service account JSON key for Google API auth")
        return service_account.Credentials.from_service_account_file(
            settings.google_service_account_json, scopes=scopes
        )
    logger.info("Using ADC for Google API auth")
    credentials, _ = google_auth_default(scopes=scopes)
    return credentials
