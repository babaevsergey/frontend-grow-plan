import { SequenceDiagram } from "./SequenceDiagram";

export function JwtVsSessionDiagram() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold text-slate-500">Session</p>
        <SequenceDiagram
          steps={["Клиент:\nsessionId в cookie", "Сервер ищет сессию\nв Redis/БД", "Есть запись → доступ"]}
          arrowLabels={["каждый запрос", "обращение к хранилищу"]}
          accentIndex={1}
          ariaLabel="При session-based аутентификации сервер по sessionId ищет запись сессии в своём хранилище — отзыв мгновенный, потому что достаточно удалить эту запись."
        />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold text-slate-500">JWT</p>
        <SequenceDiagram
          steps={["Клиент:\nподписанный токен", "Сервер проверяет\nтолько подпись", "Подпись верна → доступ"]}
          arrowLabels={["каждый запрос", "без обращения к БД"]}
          accentIndex={1}
          ariaLabel="При JWT сервер проверяет только криптографическую подпись токена, не обращаясь к базе данных — это быстрее, но отозвать скомпрометированный токен раньше его exp сложнее."
        />
      </div>
      <p className="text-center text-xs text-slate-500">
        Session хранит состояние на сервере (мгновенный отзыв, но нужна БД на каждый запрос). JWT
        самодостаточен (не нужна БД, но отозвать токен до истечения exp — отдельная задача).
      </p>
    </div>
  );
}
