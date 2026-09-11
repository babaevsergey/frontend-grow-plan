import { SequenceDiagram } from "./SequenceDiagram";

export function StoreFlowComparisonDiagram() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold text-slate-500">Redux</p>
        <SequenceDiagram
          steps={["Компонент", "dispatch(action)", "reducer(state, action)", "новый state", "все подписчики\nре-рендерятся"]}
          arrowLabels={["событие", "чистая функция", "иммутабельно", "useSelector"]}
          caption=""
          ariaLabel="В Redux компонент диспатчит action, reducer вычисляет новый state целиком, а все компоненты, подписанные через useSelector, проверяются на ре-рендер."
        />
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold text-slate-500">Zustand</p>
        <SequenceDiagram
          steps={["Компонент", "store.increment()", "set(state => ...)", "подписчики этого\nселектора ре-рендерятся"]}
          arrowLabels={["вызов метода", "точечное обновление", "только нужный кусок"]}
          accentIndex={3}
          caption=""
          ariaLabel="В Zustand компонент вызывает метод стора напрямую, set() точечно обновляет часть состояния, и ре-рендерятся только компоненты, подписанные именно на изменившийся кусок через селектор."
        />
      </div>
      <p className="text-center text-xs text-slate-500">
        Redux явно разделяет действие и его обработку (action → reducer); Zustand убирает этот слой и
        точечно обновляет только то, что реально изменилось.
      </p>
    </div>
  );
}
