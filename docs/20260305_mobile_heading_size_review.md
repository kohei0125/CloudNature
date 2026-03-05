# スマホ表示 H1/H2 フォントサイズ縮小レビュー

**日付**: 2026-03-05
**対象**: コーポレートサイト全体のH1・H2見出しのモバイル表示サイズ

## 検証目的

スマホ表示時のH1・H2が大きすぎる問題を修正。clamp()の最小値を縮小し、モバイル表示の可読性・バランスを改善する。

## 対象範囲

### H1 変更ファイル
| ファイル | 変更前 | 変更後 |
|---|---|---|
| `components/shared/PageHero.tsx` | `clamp(2rem,...)` → `clamp(1.5rem,...)` | 32px → 24px |
| `components/shared/PlaceholderPage.tsx` | `text-4xl` | `text-2xl md:text-4xl` |
| `app/error.tsx` | `text-4xl` | `text-2xl md:text-4xl` |
| `app/not-found.tsx` | `text-4xl` | `text-2xl md:text-4xl` |

### H2 変更ファイル
| ファイル | 変更前 | 変更後 |
|---|---|---|
| `components/shared/SectionHeader.tsx` (×2) | `clamp(1.75rem,...)` | `clamp(1.375rem,...)` |
| `components/shared/CtaBanner.tsx` | `clamp(1.75rem,...)` | `clamp(1.375rem,...)` |
| `components/philosophy/ValuesExpanded.tsx` | `clamp(1.75rem,...)` | `clamp(1.375rem,...)` |
| `components/home/MissionSection.tsx` | `clamp(1.75rem,4vw,...)` | `clamp(1.375rem,4vw,...)` |
| `components/home/NewsSection.tsx` | `clamp(1.75rem,...)` | `clamp(1.375rem,...)` |
| `components/home/CtaSection.tsx` | `clamp(1.5rem,...)` | `clamp(1.25rem,...)` |

## 確認項目

- [ ] clamp()の最小値・最大値・preferred値が適切か
- [ ] H1とH2の階層（サイズ差）が維持されているか
- [ ] デスクトップ表示に影響がないか
- [ ] `LegalDocument.tsx` の `text-lg` H2は変更不要か（元々小さいため）
- [ ] ビルドが通るか

## Codex レビュー結果

**結果**: 問題なし

> 変更内容を確認しましたが、既存機能やビルドを壊す明確な不具合は見当たりませんでした。主な差分は見出しサイズ調整と `next-env.d.ts` の参照先更新で、いずれも妥当な範囲です。

## 確認結果

- [x] clamp()の最小値・最大値・preferred値が適切か → OK
- [x] H1とH2の階層（サイズ差）が維持されているか → OK（H1: 24px, H2: 22px/20px）
- [x] デスクトップ表示に影響がないか → OK（最大値は変更なし）
- [x] `LegalDocument.tsx` の `text-lg` H2は変更不要か → OK（元々小さいため対象外）
- [x] ビルドが通るか → OK
