import { SequenceDiagram } from "./SequenceDiagram";

export function HydrationDiagram() {
  return (
    <SequenceDiagram
      steps={["Сервер рендерит HTML", "Браузер красит HTML\n(уже виден контент)", "Загружается JS-бандл", "Hydration:\nReact навешивает обработчики"]}
      arrowLabels={["отправка", "параллельно", "React \"узнаёт\" разметку"]}
      accentIndex={3}
      accentArrowIndex={2}
      branch={{
        afterIndex: 3,
        label: "разметка не совпала",
        note: ["Hydration mismatch", "(предупреждение в консоли)"],
      }}
      caption="Между появлением готовой разметки и тем, что страница становится интерактивной, есть заметный разрыв — если результат клиентского рендера отличается от серверного, возникает hydration mismatch."
      ariaLabel="После SSR браузер сразу показывает готовый HTML, но интерактивность появляется только после загрузки JS и гидрации; если разметка на клиенте отличается от серверной, React выдаёт предупреждение о hydration mismatch."
    />
  );
}
