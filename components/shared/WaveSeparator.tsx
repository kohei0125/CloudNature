import React from 'react';
import { cn } from "@/lib/utils";

interface WaveSeparatorProps {
  position?: 'top' | 'bottom';
  color?: string;
  bgColor?: string; // Color of the section adjacent
  className?: string;
  withTexture?: boolean;
}

// 波の「上側」を塗る形。position='top' はこの形を 180 度回転させて使う。
const WAVE_PATH_UPPER =
  "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z";
// 同じ曲線で、波の「下側」（viewBox の y=120 まで）を塗る形。
const WAVE_PATH_LOWER =
  "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z";

const WaveSeparator: React.FC<WaveSeparatorProps> = ({
  position = 'bottom',
  color = '#ffffff',
  bgColor = 'transparent',
  className,
  withTexture = true
}) => {
  const isTop = position === 'top';
  // 上端／下端に接する色。position='top' は波を 180 度回転させるため上下が入れ替わる。
  // ボックス上端の色は必ず背景で塗る。SVG のパスで塗ると、端数ピクセル位置に置かれたときに
  // 縁がアンチエイリアスされ、下地の色が透けて 1px の横線として見えてしまうため
  // （DPR の高い iOS Safari で顕著）。下端は margin-bottom:-1px で次セクションの背景が
  // 1px 重なるので、そちらに覆われる。
  const topColor = isTop ? bgColor : color;
  const bottomColor = isTop ? color : bgColor;

  return (
    <div
      className={cn("w-full overflow-hidden leading-[0] relative -my-px", withTexture && "texture-grain", isTop && "rotate-180", className)}
      style={{ backgroundColor: topColor }}
    >
      <svg
        className="relative block w-[calc(100%+1.3px)] h-[36px] md:h-[56px]"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
        aria-hidden="true"
      >
        {/* 背景が塗っていない側（上端に接しない側）だけをパスで塗る */}
        <path d={isTop ? WAVE_PATH_UPPER : WAVE_PATH_LOWER} fill={bottomColor}></path>
      </svg>
    </div>
  );
};

export default WaveSeparator;
