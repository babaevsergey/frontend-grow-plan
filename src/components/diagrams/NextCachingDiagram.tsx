import { SequenceDiagram } from "./SequenceDiagram";

export function NextCachingDiagram() {
  return (
    <SequenceDiagram
      steps={["Запрос страницы", "Data Cache\n(результаты fetch)", "Full Route Cache\n(готовый HTML/RSC)", "Router Cache\n(на клиенте)", "Ответ пользователю"]}
      arrowLabels={["revalidate?", "статический маршрут?", "уже посещали?"]}
      accentIndex={1}
      caption="Три независимых слоя кэша решают разные задачи — если данные кажутся устаревшими, важно понять, какой именно слой это отдаёт: fetch cache, кэш страницы или кэш роутера на клиенте."
      ariaLabel="Запрос страницы в Next.js последовательно проходит через три независимых слоя кэша: Data Cache для результатов fetch, Full Route Cache для готовой разметки и Router Cache на стороне клиента для уже посещённых маршрутов."
    />
  );
}
