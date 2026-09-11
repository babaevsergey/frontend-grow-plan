const ACCENT = "#3b6ff2";

export function EventLoopDiagram() {
  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 460 300"
          role="img"
          aria-label="Call Stack выполняет синхронный код. Асинхронные задачи уходят в Web APIs, откуда таймеры и колбэки попадают в Macrotask Queue, а промисы — в Microtask Queue. Event Loop переносит задачу в стек только когда стек пуст, и всегда сначала вычищает всю Microtask Queue, и только потом берёт одну задачу из Macrotask Queue."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 400 }}
        >
          <defs>
            <marker id="el-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
            <marker id="el-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={ACCENT} />
            </marker>
          </defs>

          <rect x="10" y="10" width="200" height="70" rx="8" fill="none" stroke="currentColor" />
          <text x="110" y="35" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">Call Stack</text>
          <text x="110" y="55" textAnchor="middle" fontSize="10" fill="currentColor">выполняет синхронный код</text>

          <rect x="250" y="10" width="200" height="70" rx="8" fill="none" stroke="currentColor" />
          <text x="350" y="35" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">Web APIs</text>
          <text x="350" y="55" textAnchor="middle" fontSize="10" fill="currentColor">setTimeout, fetch, DOM-события</text>

          <rect x="250" y="120" width="200" height="60" rx="8" fill="none" stroke="currentColor" />
          <text x="350" y="145" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">Macrotask Queue</text>
          <text x="350" y="163" textAnchor="middle" fontSize="10" fill="currentColor">таймеры, события, I/O</text>

          <rect x="10" y="120" width="200" height="60" rx="8" fill="#eef4ff" stroke={ACCENT} strokeWidth="2" />
          <text x="110" y="145" textAnchor="middle" fontSize="12" fontWeight="600" fill={ACCENT}>Microtask Queue</text>
          <text x="110" y="163" textAnchor="middle" fontSize="10" fill={ACCENT}>promise.then, queueMicrotask</text>

          <line x1="250" y1="45" x2="212" y2="45" stroke="currentColor" markerEnd="url(#el-arrow)" />
          <text x="230" y="38" textAnchor="middle" fontSize="9" fill="currentColor">вызов</text>

          <line x1="350" y1="80" x2="350" y2="118" stroke="currentColor" markerEnd="url(#el-arrow)" />
          <line x1="110" y1="80" x2="110" y2="118" stroke={ACCENT} markerEnd="url(#el-arrow-accent)" />

          <rect x="80" y="230" width="300" height="50" rx="8" fill="none" stroke="currentColor" />
          <text x="230" y="252" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">
            Event Loop
          </text>
          <text x="230" y="270" textAnchor="middle" fontSize="10" fill="currentColor">
            стек пуст → сначала вся microtask, потом 1 macrotask
          </text>

          <line x1="110" y1="230" x2="110" y2="80" stroke={ACCENT} strokeDasharray="4 3" markerEnd="url(#el-arrow-accent)" />
          <line x1="350" y1="230" x2="110" y2="80" stroke="currentColor" strokeDasharray="4 3" markerEnd="url(#el-arrow)" />
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Event Loop берёт задачу в Call Stack только когда тот пуст, и микрозадачи (промисы) всегда
        приоритетнее макрозадач (таймеры) — поэтому promise.then срабатывает раньше, чем setTimeout(fn, 0).
      </figcaption>
    </figure>
  );
}
