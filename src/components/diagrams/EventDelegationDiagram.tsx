const ACCENT = "#3b6ff2";

export function EventDelegationDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 400 200"
          role="img"
          aria-label="Один обработчик на родительском ul ловит клик по любому дочернему li благодаря всплытию события — не нужно вешать отдельный обработчик на каждый li."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 360 }}
        >
          <defs>
            <marker id="ed-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
            </marker>
          </defs>

          <rect x="110" y="20" width="180" height="44" rx="8" fill="none" stroke="currentColor" />
          <text x="200" y="46" textAnchor="middle" fontSize="13" fill="currentColor">ul (один обработчик)</text>

          <line x1="200" y1="64" x2="60" y2="136" stroke="currentColor" />
          <line x1="200" y1="64" x2="340" y2="136" stroke="currentColor" />
          <line x1="200" y1="130" x2="200" y2="70" stroke={ACCENT} strokeWidth="2" markerEnd="url(#ed-arrow)" />

          <rect x="20" y="140" width="80" height="40" rx="6" fill="none" stroke="currentColor" />
          <text x="60" y="164" textAnchor="middle" fontSize="12" fill="currentColor">li</text>

          <rect x="160" y="140" width="80" height="40" rx="6" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="200" y="164" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="600">li (клик)</text>

          <rect x="300" y="140" width="80" height="40" rx="6" fill="none" stroke="currentColor" />
          <text x="340" y="164" textAnchor="middle" fontSize="12" fill="currentColor">li</text>

          <text x="210" y="100" fontSize="11" fill={ACCENT}>
            event.target = этот li,
          </text>
          <text x="210" y="114" fontSize="11" fill={ACCENT}>
            событие всплывает вверх
          </text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Обработчик висит на ul, а не на каждом li: клик по любому дочернему элементу всплывает наверх,
        и внутри обработчика event.target подсказывает, по какому именно li кликнули.
      </figcaption>
    </figure>
  );
}
