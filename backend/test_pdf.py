"""お見積書PDFの手動スモークテスト。

フロントエンド (estimate) の dev サーバーを起動した状態で実行する:
    $ python test_pdf.py
日本語・確認事項・精度・複数ページ（長文）をカバーする実データ相当のサンプルで
PDFを生成し、文字化けや改ページ崩れを目視確認する。
"""

import asyncio

from app.services.pdf_service import fetch_pdf_from_frontend

# 標準ケース: 日本語・確認事項・精度あり
SAMPLE_STANDARD = {
    "project_name": "受発注管理システム構築",
    "summary": "現状Excel・電話・FAXで行っている受発注業務をWebシステム化し、"
    "在庫の可視化と承認フローの自動化により事務工数削減を目指します。",
    "features": [
        {
            "name": "受発注管理",
            "detail": "発注・受注の一元管理と進捗ステータス管理",
            "standard_price": 1_200_000,
            "hybrid_price": 720_000,
        },
        {
            "name": "在庫管理",
            "detail": "入出庫履歴と在庫数のリアルタイム表示",
            "standard_price": 900_000,
            "hybrid_price": 540_000,
        },
        {
            "name": "承認ワークフロー",
            "detail": "発注金額に応じた多段階承認フロー",
            "standard_price": 1_000_000,
            "hybrid_price": 600_000,
        },
    ],
    "discussion_agenda": [
        "既存の基幹システムとの連携要否と方式",
        "承認フローの具体的な段階数と権限設計",
        "在庫の管理拠点数とロケーション管理の粒度",
    ],
    "total_cost": {
        "standard": 3_100_000,
        "hybrid": 1_860_000,
        "message": "ハイブリッド開発なら約40%のコスト削減が見込めます。",
    },
    "confidence_note": "未確定の要件があるため精度は中程度です。",
    "confidence": {"range_label": "±30%", "level": "medium"},
}

# 複数ページケース: 機能多数＋長文 detail
SAMPLE_MULTIPAGE = {
    "project_name": "基幹システム刷新",
    "summary": "全社の基幹業務を統合する大規模プロジェクトです。",
    "features": [
        {
            "name": f"機能{i + 1}",
            "detail": f"これは機能{i + 1}の詳細説明で、やや長めの日本語テキストを含みます。",
            "standard_price": 600_000,
            "hybrid_price": 360_000,
        }
        for i in range(12)
    ],
    "discussion_agenda": ["要件Aの確認", "要件Bの確認", "要件Cの確認"],
    "total_cost": {"standard": 7_200_000, "hybrid": 4_320_000, "message": ""},
    "confidence": {"range_label": "±50%", "level": "low"},
}

# 最小ケース: 任意フィールド欠落（フォールバック確認）
SAMPLE_MINIMAL = {
    "project_name": "小規模PoC",
    "features": [
        {
            "name": "問い合わせ管理",
            "detail": "フォームからの問い合わせを一元管理",
            "standard_price": 500_000,
            "hybrid_price": 500_000,
        }
    ],
    "total_cost": {"standard": 500_000, "hybrid": 500_000, "message": ""},
}


async def main() -> None:
    cases = {
        "test_standard.pdf": (SAMPLE_STANDARD, "サンプル商事株式会社"),
        "test_multipage.pdf": (SAMPLE_MULTIPAGE, "大規模開発株式会社"),
        "test_minimal.pdf": (SAMPLE_MINIMAL, "テスト合同会社"),
    }
    for filename, (data, client_name) in cases.items():
        pdf = await fetch_pdf_from_frontend(data, client_name=client_name)
        if pdf:
            with open(filename, "wb") as f:
                f.write(pdf)
            print(f"OK: {filename} ({len(pdf)} bytes)")
        else:
            print(f"FAILED: {filename}")


if __name__ == "__main__":
    asyncio.run(main())
