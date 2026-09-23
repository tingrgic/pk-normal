type Direction = "diagonal" | "down-right" | "down" | "up";

const rotation: Record<Direction, number> = {
  diagonal: 0,
  "down-right": 90,
  down: 135,
  up: -45,
};

/** Square-cut trajectory mark; SVG prevents platform emoji substitution. */
export default function Arrow({ direction = "diagonal" }: { direction?: Direction }) {
  return (
    <span className="trajectory-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" focusable="false">
        <g transform={`rotate(${rotation[direction]} 12 12)`}>
          <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" />
        </g>
      </svg>
    </span>
  );
}
