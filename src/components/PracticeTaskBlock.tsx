export function PracticeTaskBlock({ task, pitfalls }: { task?: string; pitfalls: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {task && (
        <section className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-amber-700">Практическая задача</h3>
          <p className="text-sm text-slate-700">{task}</p>
        </section>
      )}

      <section className="rounded-lg border border-rose-100 bg-rose-50/50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-rose-700">Типичные ошибки</h3>
        {pitfalls.length > 0 ? (
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            {pitfalls.map((pitfall, i) => (
              <li key={i}>{pitfall}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Пока не заполнено.</p>
        )}
      </section>
    </div>
  );
}
