const ACCENT = "#3b6ff2";
const GREEN = "#3f9142";
const ROSE = "#e11d48";

export function PromiseStateDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 380 220"
          role="img"
          aria-label="Промис создаётся в состоянии pending и может перейти только один раз — либо в fulfilled с результатом (вызывает обработчики then), либо в rejected с причиной ошибки (вызывает обработчики catch). Обратного перехода не существует."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 340 }}
        >
          <defs>
            <marker id="ps-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={GREEN} />
            </marker>
            <marker id="ps-arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={ROSE} />
            </marker>
          </defs>

          <rect x="140" y="10" width="100" height="50" rx="25" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="190" y="40" textAnchor="middle" fontSize="12" fontWeight="600" fill={ACCENT}>
            pending
          </text>

          <line x1="165" y1="60" x2="80" y2="140" stroke={GREEN} strokeWidth="2" markerEnd="url(#ps-arrow-green)" />
          <text x="95" y="100" fontSize="10" fill={GREEN}>resolve(value)</text>

          <line x1="215" y1="60" x2="300" y2="140" stroke={ROSE} strokeWidth="2" markerEnd="url(#ps-arrow-rose)" />
          <text x="255" y="100" fontSize="10" fill={ROSE}>reject(error)</text>

          <rect x="10" y="150" width="140" height="50" rx="8" fill="none" stroke={GREEN} strokeWidth="2" />
          <text x="80" y="172" textAnchor="middle" fontSize="12" fontWeight="600" fill={GREEN}>
            fulfilled
          </text>
          <text x="80" y="190" textAnchor="middle" fontSize="10" fill={GREEN}>
            → .then(onSuccess)
          </text>

          <rect x="230" y="150" width="140" height="50" rx="8" fill="none" stroke={ROSE} strokeWidth="2" />
          <text x="300" y="172" textAnchor="middle" fontSize="12" fontWeight="600" fill={ROSE}>
            rejected
          </text>
          <text x="300" y="190" textAnchor="middle" fontSize="10" fill={ROSE}>
            → .catch(onError)
          </text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Переход происходит ровно один раз и необратим: из pending промис попадает либо в fulfilled,
        либо в rejected — и дальше уже не меняет состояние, сколько раз бы ни вызывали resolve/reject.
      </figcaption>
    </figure>
  );
}
