export function PracticeTaskBlock({ task, pitfalls }: { task?: string; pitfalls: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {task && (
        <section className="rounded-lg border-l-4 border-l-amber-400 bg-amber-50/50 p-4 dark:border-l-amber-500 dark:bg-amber-500/10">
          <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-300">
            <span aria-hidden>🎯</span> Практическая задача
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">{task}</p>
        </section>
      )}

      <section className="rounded-lg border-l-4 border-l-rose-400 bg-rose-50/50 p-4 dark:border-l-rose-500 dark:bg-rose-500/10">
        <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-rose-800 dark:text-rose-300">
          <span aria-hidden>⚠️</span> Типичные ошибки
        </h3>
        {pitfalls.length > 0 ? (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {pitfalls.map((pitfall, i) => (
              <li key={i}>{pitfall}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">Пока не заполнено.</p>
        )}
      </section>
    </div>
  );
}
