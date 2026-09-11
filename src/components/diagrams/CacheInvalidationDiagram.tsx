import { SequenceDiagram } from "./SequenceDiagram";

export function CacheInvalidationDiagram() {
  return (
    <SequenceDiagram
      steps={["Мутация\n(create / update / delete)", "invalidateQueries(key)", "Рефетч в фоне", "UI получил свежие данные"]}
      arrowLabels={["onSuccess", "query активен на экране", "setQueryData"]}
      accentIndex={1}
      accentArrowIndex={0}
      caption="Мутация сама по себе не трогает уже закэшированные данные — их нужно явно инвалидировать по query key, только тогда TanStack Query делает рефетч и обновляет UI."
      ariaLabel="После мутации данные на сервере меняются, но кэш остаётся старым, пока вы явно не вызовете invalidateQueries с нужным query key — это запускает рефетч и обновление интерфейса."
    />
  );
}
