import { getFiberColor, type FiberFusion } from "@/data/fusion-data";

interface FusionDiagramProps {
  fibers: FiberFusion[];
  compact?: boolean;
}

export function FusionDiagram({ fibers, compact }: FusionDiagramProps) {
  const rowH = compact ? 22 : 28;
  const svgW = compact ? 320 : 480;
  const svgH = fibers.length * rowH + 40;
  const leftX = compact ? 60 : 100;
  const rightX = compact ? 260 : 380;
  const midX = svgW / 2;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
      {/* Headers */}
      <text x={leftX} y={16} textAnchor="middle" className="fill-muted-foreground" fontSize={compact ? 9 : 11} fontWeight={600}>
        ORIGEM
      </text>
      <text x={rightX} y={16} textAnchor="middle" className="fill-muted-foreground" fontSize={compact ? 9 : 11} fontWeight={600}>
        DESTINO
      </text>

      {fibers.map((fiber, i) => {
        const y = 30 + i * rowH + rowH / 2;
        const originColor = getFiberColor(fiber.originColor);
        const destColor = getFiberColor(fiber.destinationColor);
        const isReverse = fiber.direction === "B→A";

        return (
          <g key={fiber.fiberIndex}>
            {/* Fiber number */}
            <text x={compact ? 12 : 20} y={y + 4} fontSize={compact ? 9 : 11} fontFamily="JetBrains Mono, monospace" className="fill-muted-foreground">
              F{fiber.fiberIndex}
            </text>

            {/* Origin dot */}
            <circle cx={leftX} cy={y} r={compact ? 6 : 8} fill={originColor.hex} stroke="hsl(var(--border))" strokeWidth={1} />

            {/* Connection line */}
            <path
              d={`M ${leftX + (compact ? 8 : 10)} ${y} C ${midX} ${y}, ${midX} ${y}, ${rightX - (compact ? 8 : 10)} ${y}`}
              fill="none"
              stroke={originColor.hex}
              strokeWidth={compact ? 1.5 : 2}
              opacity={0.6}
              strokeDasharray={isReverse ? "4 3" : undefined}
            />

            {/* Direction arrow */}
            <polygon
              points={
                isReverse
                  ? `${leftX + (compact ? 14 : 18)},${y} ${leftX + (compact ? 22 : 28)},${y - 3} ${leftX + (compact ? 22 : 28)},${y + 3}`
                  : `${rightX - (compact ? 14 : 18)},${y} ${rightX - (compact ? 22 : 28)},${y - 3} ${rightX - (compact ? 22 : 28)},${y + 3}`
              }
              fill={originColor.hex}
              opacity={0.8}
            />

            {/* Destination dot */}
            <circle cx={rightX} cy={y} r={compact ? 6 : 8} fill={destColor.hex} stroke="hsl(var(--border))" strokeWidth={1} />

            {/* Attenuation label */}
            {fiber.spliceAttenuation !== undefined && (
              <text x={midX} y={y - (compact ? 6 : 8)} textAnchor="middle" fontSize={compact ? 7 : 9} fontFamily="JetBrains Mono, monospace" className="fill-muted-foreground">
                {fiber.spliceAttenuation.toFixed(2)} dB
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
