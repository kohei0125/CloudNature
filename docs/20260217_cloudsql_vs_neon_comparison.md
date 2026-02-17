# Cloud SQL vs Neon 比較分析 — AI見積もりシステムDB選定

## 結論: Neon を採用

DB操作は本質的に非同期化が可能であり、レイテンシの UX 影響は軽微。
コスト面（$0 vs ~$10/月）と運用面（サーバーレス、接続プーリング内蔵）で Neon が有利。

---

## 比較表

| 観点 | Cloud SQL (PostgreSQL 15) | Neon (Serverless PostgreSQL) |
|---|---|---|
| **東京リージョン** | あり (asia-northeast1) | なし（最寄り: Singapore） |
| **DB↔Cloud Run レイテンシ** | ~1-2ms（同一リージョン内） | ~60-80ms（東京↔シンガポール） |
| **月額コスト** | ~$10（db-f1-micro, 10GB SSD） | **$0（Free Tier: 190 CU-hours, 0.5GB）** |
| **固定費** | あり（常時起動） | **なし（従量課金、アイドル時 $0）** |
| **ネットワーク** | GCP 内部（Cloud SQL Connector） | パブリックインターネット TLS |
| **接続プーリング** | アプリ側で管理 | **Neon 側で pooler 提供** |
| **バックアップ/PITR** | 自動（7日間、SLA あり） | プラン依存（Free: 24h branch restore） |
| **SLA** | 99.95%（HA 構成時） | Free/Launch プランは SLA なし |
| **運用統一性** | GCP に完全統合 | マルチベンダー（GCP + Neon） |
| **スケールアップ** | ティア変更（db-g1-small 等） | CU 自動スケール |
| **コールドスタート** | なし（常時起動） | ~0.5s（idle→active） |

---

## レイテンシ影響の再評価

### エンドポイント別の分析

| API | DB処理 | 同期が必要か | レイテンシの UX 影響 |
|---|---|---|---|
| POST /session | INSERT 1件 | Yes（session_id を返す） | 初回1回のみ。+70ms は許容範囲 |
| POST /step (1-6, 8-10) | SELECT + UPSERT | **No（fire-and-forget 可）** | **非同期化で影響ゼロ** |
| POST /step (7) | 同上 + LLM呼び出し | No（LLM 数秒が支配的） | DB遅延は誤差 |
| POST /generate | SELECT + INSERT + LLM + UPDATE | No（LLM 数秒が支配的） | DB遅延は誤差 |
| GET /result | SELECT 1件 | Yes（だがポーリング） | 2秒間隔のため +70ms は無視可能 |

### 結論

- `/step` の回答保存を fire-and-forget にすれば、ユーザー体感に影響する同期 DB 操作は `/session`（初回1回）のみ
- `/generate` と `/step (7)` は LLM 呼び出し（数秒）が支配的で、DB レイテンシは誤差
- ポーリング（GET /result）は 2秒間隔のため +70ms は無視可能

---

## Neon 採用の判断理由

1. **コスト**: Free Tier で $0 運用可能（vs Cloud SQL ~$10/月の固定費）
2. **非同期設計**: DB 書き込みを fire-and-forget にすることでレイテンシ問題を解消
3. **サーバーレス**: アイドル時の課金なし、Cloud Run との相性が良い
4. **接続プーリング内蔵**: アプリ側の pool 管理が不要
5. **TTL 31日 + 0.5GB**: 自動削除により Free Tier のストレージ制限内で運用可能

---

## 将来 Cloud SQL に移行する条件

- Neon Free Tier の制限（190 CU-hours, 0.5GB）を超えるトラフィックが発生
- SLA が必要なビジネス要件が発生
- GCP 単一ベンダー運用が組織要件になった場合

移行は `DATABASE_URL` の変更 + Cloud SQL Connector 設定のみで可能。

---

## Sources

- [Neon Pricing](https://neon.com/pricing)
- [Neon Regions](https://neon.com/docs/introduction/regions)
- [Neon Free Tier](https://neon.com/docs/introduction/plans#free-plan)
- [Cloud SQL Pricing](https://cloud.google.com/sql/pricing)
