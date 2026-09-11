const ACCENT = "#3b6ff2";

export function ClosureScopeDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 340 220"
          role="img"
          aria-label="Функция counter() создаёт переменную count в своей области видимости и возвращает вложенную функцию increment. Эта вложенная функция сохраняет ссылку на count даже после того, как counter() завершила выполнение — это и есть замыкание."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 300 }}
        >
          <rect x="10" y="10" width="320" height="200" rx="10" fill="none" stroke="currentColor" strokeDasharray="4 3" />
          <text x="25" y="30" fontSize="11" fill="currentColor">function counter() {"{"}</text>

          <rect x="25" y="42" width="290" height="150" rx="8" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="35" y="62" fontSize="11" fill={ACCENT} fontWeight="600">
            let count = 0
          </text>
          <text x="35" y="80" fontSize="10" fill={ACCENT}>
            (живёт, пока на неё есть ссылка)
          </text>

          <rect x="40" y="96" width="260" height="80" rx="6" fill="none" stroke="currentColor" />
          <text x="50" y="114" fontSize="10" fill="currentColor">
            return function increment() {"{"}
          </text>
          <text x="60" y="132" fontSize="10" fill={ACCENT}>
            count++
          </text>
          <text x="60" y="150" fontSize="10" fill="currentColor">
            return count
          </text>
          <text x="50" y="166" fontSize="10" fill="currentColor">
            {"}"}
          </text>

          <text x="25" y="206" fontSize="11" fill="currentColor">{"}"}</text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        increment хранит ссылку на count из объемлющей области видимости counter(). Даже когда
        counter() уже отработала и её обычный стек-фрейм исчез, count продолжает жить в замыкании.
      </figcaption>
    </figure>
  );
}
