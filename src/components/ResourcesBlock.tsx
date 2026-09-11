import type { ResourceLink } from "@/types/content";

function LinkRow({ link }: { link: ResourceLink }) {
  return (
    <li>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-brand-700 underline decoration-brand-200 underline-offset-2 hover:text-brand-800 hover:decoration-brand-400"
      >
        {link.title}
      </a>
    </li>
  );
}

export function ResourcesBlock({ docs, articles }: { docs: ResourceLink[]; articles: ResourceLink[] }) {
  if (docs.length === 0 && articles.length === 0) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-800">Дополнительные материалы</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {docs.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Официальная документация
            </p>
            <ul className="flex flex-col gap-1">
              {docs.map((link) => (
                <LinkRow key={link.url} link={link} />
              ))}
            </ul>
          </div>
        )}

        {articles.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Статьи по теме
            </p>
            <ul className="flex flex-col gap-1">
              {articles.map((link) => (
                <LinkRow key={link.url} link={link} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
