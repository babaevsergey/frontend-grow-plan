const ACCENT = "#3b6ff2";

export function RenderCommitDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 860 190"
          role="img"
          aria-label="React обновляет реальный DOM только в фазе commit: если reconciliation не находит отличий между новым и предыдущим деревом элементов, commit ничего не меняет и DOM остаётся прежним."
          className="h-auto w-full min-w-[640px] text-slate-600"
        >
          <defs>
            <marker id="rcd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
            <marker id="rcd-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
            </marker>
          </defs>

          {/* branch note: reconciliation finds no diff -> DOM untouched */}
          <line x1="415" y1="110" x2="415" y2="52" stroke="currentColor" strokeDasharray="4 3" markerEnd="url(#rcd-arrow)" />
          <text x="428" y="82" fontSize="11" fill="currentColor">diff пуст</text>
          <rect x="345" y="16" width="140" height="34" rx="6" fill="none" stroke="currentColor" strokeDasharray="3 2" />
          <text x="415" y="37" textAnchor="middle" fontSize="11" fill="currentColor">DOM не тронут</text>

          {/* main flow */}
          <g fontSize="13">
            <rect x="10" y="110" width="130" height="44" rx="8" fill="none" stroke="currentColor" />
            <text x="75" y="136" textAnchor="middle" fill="currentColor">State/props</text>

            <line x1="140" y1="132" x2="178" y2="132" stroke="currentColor" markerEnd="url(#rcd-arrow)" />
            <text x="159" y="100" textAnchor="middle" fontSize="11" fill="currentColor">вызов</text>

            <rect x="180" y="110" width="110" height="44" rx="8" fill="none" stroke="currentColor" />
            <text x="235" y="136" textAnchor="middle" fill="currentColor">Render</text>

            <line x1="290" y1="132" x2="328" y2="132" stroke="currentColor" markerEnd="url(#rcd-arrow)" />
            <text x="309" y="100" textAnchor="middle" fontSize="11" fill="currentColor">новое дерево</text>

            <rect x="330" y="110" width="170" height="44" rx="8" fill="none" stroke="currentColor" />
            <text x="415" y="136" textAnchor="middle" fill="currentColor">Reconciliation</text>

            <line x1="500" y1="132" x2="543" y2="132" stroke={ACCENT} strokeWidth="2" markerEnd="url(#rcd-arrow-accent)" />
            <text x="521" y="100" textAnchor="middle" fontSize="11" fill={ACCENT}>отличия есть</text>

            <rect x="545" y="108" width="150" height="48" rx="8" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
            <text x="620" y="137" textAnchor="middle" fill={ACCENT} fontWeight="600">Commit (DOM)</text>

            <line x1="695" y1="132" x2="733" y2="132" stroke="currentColor" markerEnd="url(#rcd-arrow)" />
            <text x="714" y="100" textAnchor="middle" fontSize="11" fill="currentColor">после</text>

            <rect x="735" y="110" width="110" height="44" rx="8" fill="none" stroke="currentColor" />
            <text x="790" y="136" textAnchor="middle" fill="currentColor">Effects</text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Реальный DOM меняется только в фазе commit. Если reconciliation не находит отличий между деревьями
        элементов — commit ничего не обновляет, и DOM остаётся прежним.
      </figcaption>
    </figure>
  );
}
