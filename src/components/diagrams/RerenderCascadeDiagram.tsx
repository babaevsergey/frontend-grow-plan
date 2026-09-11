const ACCENT = "#3b6ff2";

function MiniTree({ childrenRerender, title }: { childrenRerender: boolean; title: string }) {
  const childFill = childrenRerender ? "#eef4ff" : "none";
  const childStroke = childrenRerender ? ACCENT : "currentColor";
  const childText = childrenRerender ? ACCENT : "currentColor";

  return (
    <div className="flex-1">
      <p className="mb-1 text-center text-xs font-semibold text-slate-500">{title}</p>
      <svg
        viewBox="0 0 220 160"
        role="img"
        aria-label={
          childrenRerender
            ? "Без memo: у родителя изменился state, и вместе с ним ре-рендерятся оба дочерних компонента, хотя их пропсы не менялись."
            : "С React.memo: родитель ре-рендерится, но дочерние компоненты пропускают рендер, потому что их пропсы не изменились."
        }
        className="h-auto w-full text-slate-600"
      >
        <line x1="110" y1="50" x2="55" y2="100" stroke="currentColor" />
        <line x1="110" y1="50" x2="165" y2="100" stroke="currentColor" />

        <rect x="60" y="10" width="100" height="40" rx="8" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
        <text x="110" y="35" textAnchor="middle" fontSize="12" fill={ACCENT} fontWeight="600">
          Parent (state)
        </text>

        <rect x="10" y="100" width="90" height="36" rx="6" fill={childFill} stroke={childStroke} />
        <text x="55" y="122" textAnchor="middle" fontSize="12" fill={childText}>
          Child A
        </text>

        <rect x="120" y="100" width="90" height="36" rx="6" fill={childFill} stroke={childStroke} />
        <text x="165" y="122" textAnchor="middle" fontSize="12" fill={childText}>
          Child B
        </text>
      </svg>
    </div>
  );
}

export function RerenderCascadeDiagram() {
  return (
    <figure className="my-1">
      <div className="flex flex-col gap-4 sm:flex-row">
        <MiniTree childrenRerender title="Без memo" />
        <MiniTree childrenRerender={false} title="С React.memo" />
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        По умолчанию ре-рендер родителя тянет за собой всех детей, даже если их пропсы не изменились.
        React.memo сравнивает пропсы и пропускает рендер, если они не изменились по ссылке.
      </figcaption>
    </figure>
  );
}
