const LAYERS = ["app", "pages", "widgets", "features", "entities", "shared"];
const BAND_H = 48;
const GAP = 6;
const START_Y = 10;
const BAND_X = 90;
const BAND_W = 220;

function bandY(i: number) {
  return START_Y + i * (BAND_H + GAP);
}

export function FeatureSlicedLayersDiagram() {
  const sharedIndex = LAYERS.indexOf("shared");
  const featuresIndex = LAYERS.indexOf("features");
  const sharedCenterY = bandY(sharedIndex) + BAND_H / 2;
  const featuresCenterY = bandY(featuresIndex) + BAND_H / 2;
  const appCenterY = bandY(0) + BAND_H / 2;

  return (
    <figure className="my-1">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 460 340"
          role="img"
          aria-label="Feature-Sliced Design: слои app, pages, widgets, features, entities, shared расположены сверху вниз; импорт разрешён только сверху вниз, а импорт нижнего слоя из верхнего (например, shared из features) запрещён."
          className="h-auto w-full text-slate-600"
          style={{ minWidth: 400 }}
        >
          <defs>
            <marker id="fsd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
            <marker id="fsd-arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#e11d48" />
            </marker>
          </defs>

          {LAYERS.map((label, i) => (
            <g key={label}>
              <rect x={BAND_X} y={bandY(i)} width={BAND_W} height={BAND_H} rx="6" fill="none" stroke="currentColor" />
              <text x={BAND_X + BAND_W / 2} y={bandY(i) + BAND_H / 2 + 4} textAnchor="middle" fontSize="13" fill="currentColor">
                {label}
              </text>
            </g>
          ))}

          {/* allowed: import only downward */}
          <line x1="330" y1={appCenterY} x2="330" y2={sharedCenterY} stroke="currentColor" markerEnd="url(#fsd-arrow)" />
          <text x="340" y={(appCenterY + sharedCenterY) / 2} fontSize="11" fill="currentColor">
            импорт только вниз
          </text>

          {/* forbidden: shared importing from features (upward) */}
          <line
            x1="60"
            y1={sharedCenterY}
            x2="60"
            y2={featuresCenterY}
            stroke="#e11d48"
            strokeDasharray="4 3"
            markerEnd="url(#fsd-arrow-rose)"
          />
          <text x="60" y={(sharedCenterY + featuresCenterY) / 2 + 4} textAnchor="middle" fontSize="16" fill="#e11d48">
            ✕
          </text>
          <text
            x="30"
            y={(sharedCenterY + featuresCenterY) / 2}
            textAnchor="middle"
            fontSize="11"
            fill="#e11d48"
            transform={`rotate(-90 30 ${(sharedCenterY + featuresCenterY) / 2})`}
          >
            нельзя
          </text>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-xs text-slate-500">
        Каждый слой может импортировать только слои ниже себя. shared — самый переиспользуемый и
        независимый слой, поэтому он никогда не должен знать о features, widgets или конкретных страницах.
      </figcaption>
    </figure>
  );
}
