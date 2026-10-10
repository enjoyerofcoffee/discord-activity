const ARROWS = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"];

type ArrowProps = {
  arrow: number | null;
};

export const Arrow = ({ arrow }: ArrowProps) => {
  if (arrow === null) return <span>🎉</span>;

  return <span>{ARROWS[Math.round(arrow / 45) % ARROWS.length]}</span>;
};
