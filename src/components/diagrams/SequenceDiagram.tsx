const ACCENT = "#3b6ff2";
const CHAR_W = 7.3;
const PAD = 28;
const MIN_W = 92;
const BOX_H = 44;
const GAP = 52;
const START_X = 10;

function boxWidth(label: string): number {
  const longest = Math.max(...label.split("\n").map((l) => l.length));
  return Math.max(MIN_W, Math.round(longest * CHAR_W + PAD));
}

export interface SequenceBranch {
  /** индекс шага (0-based), от верхней грани которого идёт пунктирная ветка вверх */
  afterIndex: number;
  /** подпись у пунктирной стрелки */
  label: string;
  /** строки текста в боксе-примечании над схемой */
  note: string[];
}

export function SequenceDiagram({
  steps,
  arrowLabels,
  accentIndex,
  accentArrowIndex,
  branch,
  caption,
  ariaLabel,
}: {
  steps: string[];
  arrowLabels?: string[];
  accentIndex?: number;
  accentArrowIndex?: number;
  branch?: SequenceBranch;
  caption?: string;
  ariaLabel: string;
}) {
  const widths = steps.map(boxWidth);
  const xs: number[] = [];
  let cursor = START_X;
  for (const w of widths) {
    xs.push(cursor);
    cursor += w + GAP;
  }
  const totalWidth = cursor - GAP + 10;

  const hasBranch = Boolean(branch);
  const mainY = hasBranch ? 100 : 30;
  const centerY = mainY + BOX_H / 2;
  const noteH = 34;
  const noteY = 14;
  const totalHeight = mainY + BOX_H + 30;

  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          role="img"
          aria-label={ariaLabel}
          className="h-auto w-full text-slate-600"
          style={{ minWidth: Math.min(totalWidth, 640) }}
        >
          <defs>
            <marker id="seq-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
            <marker id="seq-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
            </marker>
          </defs>

          {branch && (
            <>
              <line
                x1={xs[branch.afterIndex] + widths[branch.afterIndex] / 2}
                y1={mainY}
                x2={xs[branch.afterIndex] + widths[branch.afterIndex] / 2}
                y2={noteY + noteH}
                stroke="currentColor"
                strokeDasharray="4 3"
                markerEnd="url(#seq-arrow)"
              />
              <text
                x={xs[branch.afterIndex] + widths[branch.afterIndex] / 2 + 10}
                y={(mainY + noteY + noteH) / 2 + 4}
                fontSize="11"
                fill="currentColor"
              >
                {branch.label}
              </text>
              <rect
                x={xs[branch.afterIndex] + widths[branch.afterIndex] / 2 - 75}
                y={noteY}
                width="150"
                height={noteH}
                rx="6"
                fill="none"
                stroke="currentColor"
                strokeDasharray="3 2"
              />
              {branch.note.map((line, i) => (
                <text
                  key={i}
                  x={xs[branch.afterIndex] + widths[branch.afterIndex] / 2}
                  y={noteY + noteH / 2 + (branch.note.length > 1 ? (i === 0 ? -2 : 12) : 4)}
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                >
                  {line}
                </text>
              ))}
            </>
          )}

          <g fontSize="13">
            {steps.map((label, i) => {
              const isAccent = accentIndex === i;
              const lines = label.split("\n");
              return (
                <g key={i}>
                  <rect
                    x={xs[i]}
                    y={mainY}
                    width={widths[i]}
                    height={BOX_H}
                    rx="8"
                    fill={isAccent ? "#eef4ff" : "none"}
                    stroke={isAccent ? ACCENT : "currentColor"}
                    strokeWidth={isAccent ? 2 : 1}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={xs[i] + widths[i] / 2}
                      y={
                        lines.length > 1
                          ? centerY + (li === 0 ? -3 : 13)
                          : centerY + 4
                      }
                      textAnchor="middle"
                      fill={isAccent ? ACCENT : "currentColor"}
                      fontWeight={isAccent ? 600 : 400}
                    >
                      {line}
                    </text>
                  ))}

                  {i < steps.length - 1 && (
                    <>
                      <line
                        x1={xs[i] + widths[i]}
                        y1={centerY}
                        x2={xs[i + 1] - 2}
                        y2={centerY}
                        stroke={accentArrowIndex === i ? ACCENT : "currentColor"}
                        strokeWidth={accentArrowIndex === i ? 2 : 1}
                        markerEnd={accentArrowIndex === i ? "url(#seq-arrow-accent)" : "url(#seq-arrow)"}
                      />
                      {arrowLabels?.[i] && (
                        <text
                          x={xs[i] + widths[i] + GAP / 2}
                          y={mainY - 10}
                          textAnchor="middle"
                          fontSize="11"
                          fill={accentArrowIndex === i ? ACCENT : "currentColor"}
                        >
                          {arrowLabels[i]}
                        </text>
                      )}
                    </>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      {caption && <figcaption className="mt-2 text-center text-xs text-slate-500">{caption}</figcaption>}
    </figure>
  );
}
