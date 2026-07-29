// 装飾用の山＋街並みライン画（手描きSVG）。
// stroke は currentColor を使うため、親要素の text カラー / opacity で色味を制御できる。
// OUR PURPOSE（明るい背景）と CTA（forest 背景）の双方で使い回す。
interface SkylineArtProps {
  className?: string;
}

const SkylineArt = ({ className }: SkylineArtProps) => (
  <svg
    viewBox="0 0 480 160"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    role="presentation"
  >
    {/* 地面のベースライン */}
    <path d="M0 132 H480" strokeOpacity={0.55} />

    {/* 左側の木（松＋低木） */}
    <g strokeOpacity={0.7}>
      <path d="M20 132 V110" />
      <path d="M8 120 L20 100 L32 120 Z" />
      <path d="M11 110 L20 94 L29 110 Z" />
      <path d="M44 132 V120" />
      <path d="M36 122 A8 8 0 0 1 52 122 Z" />
    </g>

    {/* 街並み（ビル群） */}
    <g strokeOpacity={0.85}>
      <rect x="66" y="92" width="30" height="40" />
      <path d="M74 104 H88 M74 116 H88" strokeOpacity={0.5} />

      <rect x="100" y="66" width="26" height="66" />
      <path d="M106 80 H120 M106 94 H120 M106 108 H120" strokeOpacity={0.5} />

      <rect x="130" y="84" width="20" height="48" />

      <rect x="154" y="52" width="32" height="80" />
      <path d="M170 52 V40" />
      <path d="M160 66 H180 M160 82 H180 M160 98 H180 M160 114 H180" strokeOpacity={0.5} />

      <rect x="190" y="88" width="22" height="44" />
      <path d="M196 100 H206 M196 112 H206" strokeOpacity={0.5} />

      <rect x="216" y="72" width="28" height="60" />
      <path d="M222 86 H238 M222 100 H238 M222 114 H238" strokeOpacity={0.5} />

      <rect x="248" y="98" width="22" height="34" />
      <rect x="274" y="80" width="20" height="52" />
      <path d="M279 94 H289 M279 108 H289" strokeOpacity={0.5} />
    </g>

    {/* 右側の山並み */}
    <g strokeOpacity={0.8}>
      <path d="M300 132 L370 50 L440 132" />
      <path d="M356 68 L370 50 L384 68" strokeOpacity={0.6} />
      <path d="M392 132 L440 74 L480 132" />
    </g>
  </svg>
);

export default SkylineArt;
