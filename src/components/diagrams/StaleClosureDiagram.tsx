const ACCENT = "#3b6ff2";

export function StaleClosureDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 460 200"
          role="img"
          aria-label="При первом рендере count=0 создаётся замыкание внутри setTimeout, которое запоминает именно это значение. Даже если count потом станет 5, старое замыкание всё равно видит count=0, потому что ссылается на снимок переменной из своего рендера."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 400 }}
        >
          <defs>
            <marker id="sc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>

          <rect x="10" y="10" width="200" height="80" rx="8" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="110" y="30" textAnchor="middle" fontSize="12" fontWeight="600" fill={ACCENT}>
            Render #1
          </text>
          <text x="110" y="50" textAnchor="middle" fontSize="11" fill={ACCENT}>
            count = 0
          </text>
          <text x="110" y="68" textAnchor="middle" fontSize="11" fill={ACCENT}>
            setTimeout(() =&gt; log(count))
          </text>

          <rect x="250" y="10" width="200" height="80" rx="8" fill="none" stroke="currentColor" />
          <text x="350" y="30" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">
            Render #2
          </text>
          <text x="350" y="50" textAnchor="middle" fontSize="11" fill="currentColor">
            count = 5 (новый снимок)
          </text>
          <text x="350" y="68" textAnchor="middle" fontSize="11" fill="currentColor">
            старое замыкание его не видит
          </text>

          <line x1="110" y1="90" x2="110" y2="150" stroke={ACCENT} strokeWidth="2" markerEnd="url(#sc-arrow)" />
          <rect x="20" y="150" width="180" height="40" rx="6" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="110" y="174" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="600">
            через 3с выведет: 0
          </text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Колбэк внутри setTimeout захватывает count из того рендера, в котором он был создан. Новые
        рендеры создают новые переменные и новые колбэки — старый колбэк своего значения не меняет.
      </figcaption>
    </figure>
  );
}
