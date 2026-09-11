const ACCENT = "#3b6ff2";

export function CriticalRenderingPathDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 460 200"
          role="img"
          aria-label="HTML параллельно строит DOM, а CSS — CSSOM. Оба дерева объединяются в Render Tree, который содержит только видимые элементы. Затем браузер вычисляет геометрию на шаге Layout и закрашивает пиксели на шаге Paint."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 420 }}
        >
          <defs>
            <marker id="crp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
            <marker id="crp-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
            </marker>
          </defs>

          <rect x="10" y="10" width="100" height="46" rx="8" fill="none" stroke="currentColor" />
          <text x="60" y="38" textAnchor="middle" fontSize="12" fill="currentColor">HTML → DOM</text>

          <rect x="10" y="80" width="100" height="46" rx="8" fill="none" stroke="currentColor" />
          <text x="60" y="108" textAnchor="middle" fontSize="12" fill="currentColor">CSS → CSSOM</text>

          <line x1="110" y1="33" x2="150" y2="70" stroke="currentColor" markerEnd="url(#crp-arrow)" />
          <line x1="110" y1="103" x2="150" y2="80" stroke="currentColor" markerEnd="url(#crp-arrow)" />

          <rect x="150" y="60" width="120" height="46" rx="8" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="210" y="88" textAnchor="middle" fontSize="12" fontWeight="600" fill={ACCENT}>Render Tree</text>

          <line x1="270" y1="83" x2="320" y2="83" stroke={ACCENT} strokeWidth="2" markerEnd="url(#crp-arrow-accent)" />

          <rect x="320" y="60" width="60" height="46" rx="8" fill="none" stroke="currentColor" />
          <text x="350" y="88" textAnchor="middle" fontSize="12" fill="currentColor">Layout</text>

          <line x1="380" y1="83" x2="420" y2="83" stroke="currentColor" markerEnd="url(#crp-arrow)" />

          <rect x="410" y="60" width="45" height="46" rx="8" fill="none" stroke="currentColor" />
          <text x="432" y="88" textAnchor="middle" fontSize="12" fill="currentColor">Paint</text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        DOM и CSSOM строятся параллельно и независимо, а сливаются только в Render Tree — там остаются
        лишь видимые узлы. Дальше идёт Layout (геометрия) и Paint (пиксели на экране).
      </figcaption>
    </figure>
  );
}
