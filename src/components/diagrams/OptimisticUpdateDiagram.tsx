const ACCENT = "#3b6ff2";
const GREEN = "#3f9142";
const ROSE = "#e11d48";

export function OptimisticUpdateDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 460 200"
          role="img"
          aria-label="При клике UI сразу обновляется оптимистично, не дожидаясь ответа сервера, и параллельно уходит запрос. Если сервер отвечает успехом — оптимистичное состояние просто подтверждается. Если сервер отвечает ошибкой — UI откатывается к предыдущему состоянию и показывает ошибку."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 400 }}
        >
          <defs>
            <marker id="ou-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
            <marker id="ou-arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={GREEN} />
            </marker>
            <marker id="ou-arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={ROSE} />
            </marker>
          </defs>

          <rect x="10" y="70" width="110" height="50" rx="8" fill="none" stroke="currentColor" />
          <text x="65" y="100" textAnchor="middle" fontSize="12" fill="currentColor">Клик пользователя</text>

          <rect x="170" y="70" width="120" height="50" rx="8" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="230" y="94" textAnchor="middle" fontSize="12" fontWeight="600" fill={ACCENT}>
            UI обновлён
          </text>
          <text x="230" y="110" textAnchor="middle" fontSize="10" fill={ACCENT}>
            сразу, оптимистично
          </text>

          <line x1="120" y1="95" x2="168" y2="95" stroke="currentColor" markerEnd="url(#ou-arrow)" />

          <rect x="170" y="10" width="120" height="34" rx="6" fill="none" stroke="currentColor" strokeDasharray="3 2" />
          <text x="230" y="31" textAnchor="middle" fontSize="10" fill="currentColor">запрос на сервер (фон)</text>
          <line x1="230" y1="70" x2="230" y2="46" stroke="currentColor" strokeDasharray="3 2" markerStart="url(#ou-arrow)" />

          <line x1="290" y1="85" x2="380" y2="55" stroke={GREEN} strokeWidth="2" markerEnd="url(#ou-arrow-green)" />
          <line x1="290" y1="105" x2="380" y2="145" stroke={ROSE} strokeWidth="2" markerEnd="url(#ou-arrow-rose)" />

          <rect x="380" y="30" width="70" height="50" rx="8" fill="none" stroke={GREEN} strokeWidth="2" />
          <text x="415" y="50" textAnchor="middle" fontSize="11" fontWeight="600" fill={GREEN}>Успех</text>
          <text x="415" y="66" textAnchor="middle" fontSize="9" fill={GREEN}>подтверждено</text>

          <rect x="380" y="120" width="70" height="50" rx="8" fill="none" stroke={ROSE} strokeWidth="2" />
          <text x="415" y="140" textAnchor="middle" fontSize="11" fontWeight="600" fill={ROSE}>Ошибка</text>
          <text x="415" y="156" textAnchor="middle" fontSize="9" fill={ROSE}>откат UI</text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        UI не ждёт ответа сервера — он обновляется сразу же после действия пользователя. Запрос уходит
        параллельно: успех лишь подтверждает уже показанное состояние, а ошибка откатывает UI назад.
      </figcaption>
    </figure>
  );
}
