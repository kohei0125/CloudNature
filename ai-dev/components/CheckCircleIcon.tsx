/**
 * チェックマーク付きの円アイコン（塗り＝currentColor）。
 * サイズ・色は呼び出し側のラッパー（.badge-check / .problem-card__check 等）で制御する。
 */
export default function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="currentColor" stroke="none" />
      <path
        d="M7.5 12.5l3 3 6-6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
