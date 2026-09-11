import { SequenceDiagram } from "./SequenceDiagram";

export function RefreshTokenDiagram() {
  return (
    <SequenceDiagram
      steps={["Запрос с access token", "Сервер: 401\n(токен истёк)", "Клиент шлёт refresh token", "Сервер выдаёт новую пару токенов", "Повтор исходного запроса"]}
      arrowLabels={["Authorization: Bearer", "истёк срок", "HttpOnly cookie", "access + refresh"]}
      accentIndex={3}
      accentArrowIndex={2}
      caption="Refresh token используется редко и только для одной цели — получить новый access token, не заставляя пользователя логиниться заново."
      ariaLabel="Когда access token истекает, сервер отвечает 401, клиент посылает refresh token, получает новую пару токенов и повторяет исходный запрос уже с новым access token."
    />
  );
}
