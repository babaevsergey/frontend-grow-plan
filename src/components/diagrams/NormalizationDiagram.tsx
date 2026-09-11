const ACCENT = "#3b6ff2";
const ROSE = "#e11d48";

export function NormalizationDiagram() {
  return (
    <figure className="my-1">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <p className="mb-1 text-center text-xs font-semibold text-slate-500">Вложенно (дублирование)</p>
          <svg
            viewBox="0 0 260 190"
            role="img"
            aria-label="Во вложенной структуре объект автора дублируется в каждом комментарии — при изменении имени пользователя пришлось бы найти и обновить все копии."
            className="h-auto w-full text-slate-600"
          >
            <rect x="10" y="10" width="240" height="170" rx="8" fill="none" stroke="currentColor" />
            <text x="20" y="26" fontSize="11" fill="currentColor">post</text>

            <rect x="25" y="36" width="210" height="60" rx="6" fill="none" stroke="currentColor" />
            <text x="35" y="52" fontSize="11" fill="currentColor">comment 1</text>
            <text x="35" y="68" fontSize="11" fill={ROSE}>
              author: {"{"}id:5, name:&apos;Anna&apos;{"}"}
            </text>

            <rect x="25" y="104" width="210" height="60" rx="6" fill="none" stroke="currentColor" />
            <text x="35" y="120" fontSize="11" fill="currentColor">comment 2</text>
            <text x="35" y="136" fontSize="11" fill={ROSE}>
              author: {"{"}id:5, name:&apos;Anna&apos;{"}"}
            </text>
          </svg>
        </div>

        <div className="flex-1">
          <p className="mb-1 text-center text-xs font-semibold text-slate-500">Нормализованно (по id)</p>
          <svg
            viewBox="0 0 260 190"
            role="img"
            aria-label="В нормализованной структуре есть только одна копия пользователя в users.byId, а комментарии ссылаются на неё по id — обновление имени происходит в одном месте."
            className="h-auto w-full text-slate-600"
          >
            <rect x="10" y="20" width="90" height="44" rx="6" fill="none" stroke="currentColor" />
            <text x="55" y="38" textAnchor="middle" fontSize="10" fill="currentColor">posts.byId</text>
            <text x="55" y="52" textAnchor="middle" fontSize="10" fill="currentColor">commentIds</text>

            <rect x="120" y="10" width="100" height="90" rx="6" fill="none" stroke="currentColor" />
            <text x="170" y="26" textAnchor="middle" fontSize="10" fill="currentColor">comments.byId</text>
            <text x="170" y="50" textAnchor="middle" fontSize="10" fill="currentColor">10: authorId 5</text>
            <text x="170" y="70" textAnchor="middle" fontSize="10" fill="currentColor">11: authorId 5</text>

            <rect x="10" y="130" width="90" height="44" rx="6" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
            <text x="55" y="148" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="600">
              users.byId
            </text>
            <text x="55" y="162" textAnchor="middle" fontSize="10" fill={ACCENT} fontWeight="600">
              5: Anna
            </text>

            <line x1="100" y1="42" x2="118" y2="42" stroke="currentColor" markerEnd="url(#norm-arrow)" />
            <line x1="160" y1="100" x2="70" y2="130" stroke={ACCENT} markerEnd="url(#norm-arrow-accent)" />
            <line x1="180" y1="100" x2="80" y2="130" stroke={ACCENT} markerEnd="url(#norm-arrow-accent)" />

            <defs>
              <marker id="norm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
              </marker>
              <marker id="norm-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Слева имя автора продублировано в каждом комментарии. Справа оба комментария лишь ссылаются
        (authorId) на единственную запись в users.byId — обновить имя нужно только один раз.
      </figcaption>
    </figure>
  );
}
