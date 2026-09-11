export function TestingPyramidDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 480 220"
          role="img"
          aria-label="Пирамида тестирования: внизу много быстрых и дешёвых unit-тестов, в середине меньше integration-тестов, наверху совсем немного медленных и дорогих e2e-тестов."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 420 }}
        >
          <defs>
            <marker id="pyr-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>

          <polygon points="170,10 230,10 270,70 130,70" fill="currentColor" fillOpacity="0.06" stroke="currentColor" />
          <polygon points="130,70 270,70 320,140 80,140" fill="currentColor" fillOpacity="0.1" stroke="currentColor" />
          <polygon points="80,140 320,140 380,210 20,210" fill="currentColor" fillOpacity="0.14" stroke="currentColor" />

          <text x="200" y="48" textAnchor="middle" fontSize="13" fontWeight="600" fill="currentColor">E2E</text>
          <text x="200" y="110" textAnchor="middle" fontSize="13" fontWeight="600" fill="currentColor">Integration</text>
          <text x="200" y="180" textAnchor="middle" fontSize="13" fontWeight="600" fill="currentColor">Unit</text>

          <line x1="415" y1="15" x2="415" y2="205" stroke="currentColor" markerStart="url(#pyr-arrow)" markerEnd="url(#pyr-arrow)" />
          <text x="425" y="25" fontSize="11" fill="currentColor">медленнее, дороже</text>
          <text x="425" y="205" fontSize="11" fill="currentColor">быстрее, дешевле</text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Пропорции пирамиды — совет, а не догма: много дешёвых unit-тестов внизу, меньше integration
        посередине, и лишь горстка медленных e2e-тестов на критичные пользовательские пути наверху.
      </figcaption>
    </figure>
  );
}
