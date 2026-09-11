import { SequenceDiagram } from "./SequenceDiagram";

export function PrototypeChainDiagram() {
  return (
    <SequenceDiagram
      steps={["dog\n(own properties)", "Animal.prototype\n(speak)", "Object.prototype\n(toString...)", "null"]}
      arrowLabels={["не нашли → [[Prototype]]", "не нашли → [[Prototype]]", "конец цепочки"]}
      caption="dog.speak() ищется сначала на самом dog, и только не найдя там — поднимается по цепочке прототипов, пока не найдёт метод или не дойдёт до null."
      ariaLabel="Поиск свойства в JavaScript идёт по цепочке прототипов: сначала на самом объекте, затем на Animal.prototype, затем на Object.prototype, и только потом упирается в null."
    />
  );
}
