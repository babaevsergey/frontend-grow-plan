"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useLocaleStore } from "@/store/useLocaleStore";
import { useNotesStore } from "@/store/useNotesStore";

/**
 * Все persist-сторы созданы со skipHydration: true, поэтому сами по себе
 * они НЕ читают localStorage при создании — и на сервере, и на первом
 * клиентском рендере (то есть во время самой гидратации React) они
 * отдают одинаковые дефолтные значения. Это устраняет hydration mismatch.
 *
 * Реальное восстановление данных из localStorage происходит здесь, один раз,
 * уже ПОСЛЕ того как React закончил гидратацию (useEffect гарантированно
 * выполняется после коммита) — это обычное обновление состояния на клиенте,
 * а не рассинхронизация SSR/client разметки.
 *
 * Компонент рендерится один раз в дереве, максимально высоко (см. AppLayout).
 */
export function StoreHydration() {
  useEffect(() => {
    useProgressStore.persist.rehydrate();
    useThemeStore.persist.rehydrate();
    useLocaleStore.persist.rehydrate();
    useNotesStore.persist.rehydrate();
  }, []);

  return null;
}
