const ACCENT = "#3b6ff2";

export function NarrowingDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 420 200"
          role="img"
          aria-label="До проверки значение имеет широкий тип string | number. Проверка typeof value === 'string' делит поток кода на две ветки: внутри true-ветки TypeScript сужает тип до string, внутри false-ветки — до number, и в каждой ветке доступны только методы своего типа."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 380 }}
        >
          <defs>
            <marker id="nw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>

          <rect x="140" y="10" width="140" height="50" rx="8" fill="none" stroke="currentColor" />
          <text x="210" y="30" textAnchor="middle" fontSize="11" fill="currentColor">value:</text>
          <text x="210" y="46" textAnchor="middle" fontSize="11" fill="currentColor">string | number</text>

          <rect x="130" y="80" width="160" height="34" rx="6" fill="none" stroke="currentColor" strokeDasharray="3 2" />
          <text x="210" y="101" textAnchor="middle" fontSize="11" fill="currentColor">
            typeof value === &apos;string&apos; ?
          </text>

          <line x1="200" y1="60" x2="200" y2="78" stroke="currentColor" markerEnd="url(#nw-arrow)" />

          <line x1="180" y1="114" x2="90" y2="150" stroke="currentColor" markerEnd="url(#nw-arrow)" />
          <line x1="240" y1="114" x2="330" y2="150" stroke="currentColor" markerEnd="url(#nw-arrow)" />

          <text x="130" y="135" fontSize="10" fill="currentColor">true</text>
          <text x="290" y="135" fontSize="10" fill="currentColor">false</text>

          <rect x="10" y="150" width="160" height="46" rx="8" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="90" y="170" textAnchor="middle" fontSize="11" fontWeight="600" fill={ACCENT}>
            value: string
          </text>
          <text x="90" y="186" textAnchor="middle" fontSize="10" fill={ACCENT}>
            value.toUpperCase()
          </text>

          <rect x="250" y="150" width="160" height="46" rx="8" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="330" y="170" textAnchor="middle" fontSize="11" fontWeight="600" fill={ACCENT}>
            value: number
          </text>
          <text x="330" y="186" textAnchor="middle" fontSize="10" fill={ACCENT}>
            value.toFixed(2)
          </text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Проверка typeof делит union-тип на две ветки: в каждой TypeScript автоматически сужает тип
        value и разрешает только методы, подходящие именно этой ветке.
      </figcaption>
    </figure>
  );
}
