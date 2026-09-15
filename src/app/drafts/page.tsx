import Link from "next/link";
import { DraftsList } from "@/components/DraftsList";

export default function DraftsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Черновик</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Все ваши заметки по всем темам в одном месте</p>
        </div>
        <Link
          href="/"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ← Назад к темам
        </Link>
      </div>

      <DraftsList />
    </div>
  );
}
