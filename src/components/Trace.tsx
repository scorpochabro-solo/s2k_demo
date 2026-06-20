"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  ОСЕВАЯ ШИНА — «Живой ток».                                         */
/*                                                                    */
/*  По центру страницы (CX=50 в viewBox 0..100×0..1000) спускается    */
/*  графитовая магистраль. У заголовка секции она делает скруглённый  */
/*  ортогональный «карман» (keep-out) в одну из сторон и возвращается */
/*  на центр — внутри кармана сидит монументальный заголовок, линия и */
/*  тип сцепляются. Графит нарисован всегда; драма — единственный      */
/*  оранжевый ПАКЕТ (бело-горячая голова + короткий гаснущий хвост),  */
/*  который НЕПРЕРЫВНО едет ВНИЗ по шине (CSS @keyframes, без скролла) */
/*  и поджигает «пайку» секции в момент прохода. К #contact ток       */
/*  крещендирует (быстрее/ярче/плотнее) и втекает в «маяк» формы.     */
/*                                                                    */
/*  Per-section SVG (НЕ одна мега-SVG). preserveAspectRatio=none +    */
/*  non-scaling-stroke: толщина штриха постоянна при Y-растяжении.     */
/*  Непрерывный ток — чистый CSS @keyframes на strokeDashoffset:      */
/*  ноль React-ре-рендеров/кадр, ноль getTotalLength/getPointAtLength.*/
/*  Скролл-пружина модулирует ТОЛЬКО --boost (opacity bloom + толщина */
/*  головы) — на непересекающихся с dashoffset свойствах (нет гонки). */
/* ------------------------------------------------------------------ */

/* --- Геометрия кармана (единицы viewBox) --- */
const CX = 50; // центральная ось
const CR = 3; // радиус угла по X
const CRY = 24; // радиус угла по Y
const HY0 = 90; // верхняя «губа» кармана заголовка
const HY1 = 235; // нижняя «губа» кармана заголовка

/* --- Параметры пакета (доли pathLength 0..1) --- */
const TAIL = 0.16; // длина хвоста-кометы
const HEAD = 0.02; // длина бело-горячей головы
const BIG = 10; // пробел дэша > 1 → виден ровно один сегмент

/** Прямой ствол по центру — для Hero/Contact (нет препятствия-заголовка). */
const TRUNK_D = `M ${CX} 0 L ${CX} 1000`;

/** Доля высоты, на которой стоит пайка (верхняя губа кармана). */
const PAD_Y = HY0 / 1000;

/* --- Воронка прогрева: index → heat 0..1 (источник→продажа) --- */
/* Hero (noNode accent) = источник 0; Contact ('06') = терминал 1. */
const HEAT: Record<string, number> = {
  "01": 0.15, // Услуги
  "02": 0.3, // О студии
  "03": 0.45, // Работы
  "05": 0.65, // Технологии
  "06": 1, // Контакт
};

/** index '01'..'06' → 1..6 для downstream-стаггера; иначе 0 (Hero). */
function flowIndexOf(index?: string): number {
  if (!index) return 0;
  const n = Number.parseInt(index, 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Ортогональный маршрут осевой шины с «карманом» у заголовка.
 * enterX===exitX ⇒ прямой ствол по центру (Hero 6/6, Contact 8/8).
 */
function buildBus(enterX: number, exitX: number): string {
  // Прямой ствол: равные значения = «нет перекладки», но теперь по центру.
  if (Math.abs(enterX - exitX) < 0.5) return TRUNK_D;

  // enterX больше не абсолютный X — он задаёт СТОРОНУ кармана.
  const side = enterX >= 12 ? -1 : 1; // -1 = карман СЛЕВА, +1 = СПРАВА
  // Глубина кармана: max(enter,exit)∈[6..16] → [16..34], клампим.
  const maxX = Math.max(enterX, exitX);
  const depthRaw = 16 + ((maxX - 6) / (16 - 6)) * (34 - 16);
  const depth = Math.min(34, Math.max(16, depthRaw));
  const pocketX = CX + side * depth;

  return [
    `M ${CX} 0`,
    `L ${CX} ${HY0 - CRY}`, // спуск по центру до верхней губы
    `Q ${CX} ${HY0} ${CX + side * CR} ${HY0}`, // скругление НАРУЖУ
    `L ${pocketX - side * CR} ${HY0}`,
    `Q ${pocketX} ${HY0} ${pocketX} ${HY0 + CRY}`, // вниз в боковой пробег
    `L ${pocketX} ${HY1 - CRY}`, // пробег вдоль заголовка
    `Q ${pocketX} ${HY1} ${pocketX - side * CR} ${HY1}`,
    `L ${CX + side * CR} ${HY1}`,
    `Q ${CX} ${HY1} ${CX} ${HY1 + CRY}`, // возврат на центральную ось
    `L ${CX} 1000`, // продолжение вниз по стволу
  ].join(" ");
}

export type TraceSegmentProps = {
  /** Точка входа: теперь задаёт СТОРОНУ кармана (≥12 ⇒ слева) и питает глубину. */
  enterX?: number;
  /** Точка выхода: со-задаёт глубину кармана через max(enter,exit). */
  exitX?: number;
  /** Толщина магистрали (px). Hero/Contact 3 — ствол; секции 1.5 — сигнальные сети. */
  thickness?: number;
  /** Оранжевый (ствол/терминал) или графитовый (сеть) импульс. */
  tone?: "accent" | "line";
  /** Номер узла «01», «02»… и подпись на пайке. */
  index?: string;
  label?: string;
  /** Скрыть пайку (Hero). Пакет всё равно едет по стволу. */
  noNode?: boolean;
  /** CTA-заряд у источника (Hero auto: accent && noNode). Питает .trace-cta-charge. */
  charge?: boolean;
  /** Терминал-маяк у формы (Contact auto: accent && index). Узел дышит, не гаснет. */
  terminal?: boolean;
  /** Override прогрева воронки (по умолчанию выводится из index). */
  heat?: number;
  /** Override фазового индекса стаггера (по умолчанию из index). */
  flowIndex?: number;
};

/** Дебаунс через rAF: пересчёт mobile-флага на resize без шторма ре-рендеров. */
function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setMobile(mq.matches));
    };
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return mobile;
}

/** Coarse-pointer (тач): на нём --boost не нужен — базовый ток достаточен. */
function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return coarse;
}

export function TraceSegment({
  enterX = 8,
  exitX = 8,
  thickness = 2,
  tone = "line",
  index,
  label,
  noNode = false,
  charge,
  terminal,
  heat: heatProp,
  flowIndex: flowIndexProp,
}: TraceSegmentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const coarse = useCoarsePointer();
  const rawId = useId();
  // useId возвращает токен с спецсимволами (':', '«»' в SSR) — недопустимы в
  // id/url(#…). Оставляем только [A-Za-z0-9] для безопасного селектора.
  const gradId = `busGrad-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const isAccent = tone === "accent";

  // Воронка: heat 0..1 из index (Hero noNode-accent = источник 0, Contact = 1).
  const heat =
    heatProp ?? (index ? (HEAT[index] ?? 0) : isAccent && noNode ? 0 : 0);
  // Стаггер вниз: '01'..'06' → 1..6; Hero noNode → 0.
  const flowIndex = flowIndexProp ?? flowIndexOf(index);

  // Авто-роли двух концов конверсии.
  const isCharge = charge ?? (isAccent && noNode); // Hero — источник
  const isTerminal = terminal ?? (isAccent && !!index); // Contact — маяк

  // Период тока: горячее → быстрее (3.6s..2.0s). Стаггер — отрицательная задержка.
  const flowDur = `calc(3.6s - ${heat} * 1.6s)`;
  const flowDelay = `calc(${flowDur} * ${-flowIndex} * 0.85)`;
  // Плотность: два пакета только в двух самых горячих секциях (TechStack/Contact).
  const dense = heat >= 0.65 && !mobile;

  // Скролл-пружина — ТОЛЬКО модуляция (--boost), НИКОГДА не пишет dashoffset.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const spring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  // boost 0..1: пик в центре прохода секции, спадает к краям (и в покое → 0).
  const boost = useTransform(spring, [0, 0.5, 1], [0, 1, 0]);

  // In-view гейт: вне вьюпорта рисуем только статичный базовый графит,
  // а движущиеся path-и не монтируем (≤2 секции × 2-3 path-и одновременно).
  const inView = useInView(ref, { margin: "40% 0px 40% 0px" });

  // Десктоп — карман; мобайл — прямой центрированный ствол (карман скрыл бы тип).
  const busD = mobile ? TRUNK_D : buildBus(enterX, exitX);
  const baseW = mobile ? Math.min(thickness, 2) : thickness;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] overflow-visible"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          {/* Вертикальный градиент: горячий фронт → мягко-оранжевый след. */}
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--color-accent-soft)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>

        {/* (1) БАЗОВАЯ ШИНА — графит, нарисована всегда (постоянный проводник). */}
        <path
          d={busD}
          className="trace-path"
          stroke="var(--color-line)"
          strokeWidth={baseW}
          opacity={0.9}
          fill="none"
        />

        {reduce ? (
          /* Reduced-motion: статичная, полностью прорисованная оранжевая трасса. */
          <path
            d={busD}
            className="trace-path"
            stroke="var(--color-accent)"
            strokeWidth={baseW}
            opacity={isAccent ? 0.8 : 0.5}
            fill="none"
          />
        ) : (
          inView && (
            <PulsePaths
              busD={busD}
              gradId={gradId}
              thickness={baseW}
              isAccent={isAccent}
              mobile={mobile}
              ambient={isCharge}
              heat={heat}
              flowDur={flowDur}
              flowDelay={flowDelay}
              dense={dense}
              boost={boost}
              boostActive={!coarse && !mobile}
            />
          )
        )}
      </svg>

      {!noNode && (
        <TraceNode
          index={index}
          label={label}
          side={mobile ? 1 : enterX >= 12 ? -1 : 1}
          isAccent={isAccent}
          mobile={mobile}
          reduce={!!reduce}
          terminal={isTerminal}
          flowDur={flowDur}
          flowDelay={flowDelay}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Движущиеся слои тока — монтируются только когда секция видна.      */
/*  Петля живёт в CSS (.trace-flow): JS не пишет strokeDashoffset.     */
/* ------------------------------------------------------------------ */

function PulsePaths({
  busD,
  gradId,
  thickness,
  isAccent,
  mobile,
  ambient,
  heat,
  flowDur,
  flowDelay,
  dense,
  boost,
  boostActive,
}: {
  busD: string;
  gradId: string;
  thickness: number;
  isAccent: boolean;
  mobile: boolean;
  /** Hero: бело-горячая голова дышит при первом кадре («powered on»). */
  ambient: boolean;
  /** Прогрев воронки 0..1 — красит line-хвост от графита к акценту. */
  heat: number;
  flowDur: string;
  flowDelay: string;
  /** Вторая пара комета+голова у двух самых горячих секций. */
  dense: boolean;
  /** Скролл-модуляция (disjoint от dashoffset): opacity bloom + толщина головы. */
  boost: MotionValue<number>;
  boostActive: boolean;
}) {
  // accent (ствол/терминал) — на полную; line (сеть) — сдержанно (бюджет оранжевого).
  const tailOpacity = isAccent ? 1 : 0.7;
  const headOpacity = isAccent ? 1 : 0.9;
  // Glow: СТАТИЧНЫЙ CSS-фильтр (задаётся один раз, не анимируется); на line — мягче.
  const glow = isAccent
    ? "drop-shadow(0 0 5px color-mix(in srgb, var(--color-accent) 75%, transparent))"
    : "drop-shadow(0 0 2.5px color-mix(in srgb, var(--color-accent) 55%, transparent))";

  // Тон хвоста: accent — фирменный градиент; line — color-mix, нагретый воронкой.
  // 40%..95% акцента: верх мягкий/графит, TechStack/Contact читаются полным акцентом.
  const tailStroke = isAccent
    ? `url(#${gradId})`
    : `color-mix(in srgb, var(--color-accent) calc(${40 + heat * 55}%), var(--color-line))`;

  // Скролл-буст (только тонкие свойства; dashoffset остаётся за CSS).
  // bloom-opacity: 0.2 в покое → 0.5 на пике прохода. head-strokeWidth: + до 0.6px.
  const bloomOpacity = useTransform(boost, [0, 1], [0.2, 0.5]);
  const headWidth = useTransform(
    boost,
    [0, 1],
    [thickness + 0.4, thickness + 1.0],
  );

  // Общие CSS-переменные периода/фазы тока — наследуются классом .trace-flow.
  const flowVars = {
    "--flow-dur": flowDur,
    "--flow-delay": flowDelay,
  } as React.CSSProperties;
  // Вторая пара сдвинута на полцикла вперёд — удвоенная каденция у формы.
  const flowVarsHalf = {
    "--flow-dur": flowDur,
    "--flow-delay": `calc(${flowDur} * -0.5)`,
  } as React.CSSProperties;

  // Один комплект «комета + голова» — переиспользуется для 2-го пакета (dense).
  const cometSet = (vars: React.CSSProperties, key: string) => (
    <g key={key}>
      {/* (2) ХВОСТ-КОМЕТА: один яркий дэш, наследует все изгибы кармана. */}
      <path
        d={busD}
        className="trace-path trace-flow"
        stroke={tailStroke}
        strokeWidth={thickness}
        fill="none"
        pathLength={1}
        opacity={tailOpacity}
        style={{
          ...vars,
          strokeDasharray: `${TAIL} ${BIG}`,
          // Мобайл: фильтр выключен явно (none), bloom — широкий path ниже.
          filter: mobile ? "none" : glow,
        }}
      />
      {/* (3) ГОЛОВА — бело-горячая, ярчайшая и мельчайшая точка (eye-lock). */}
      {/* На покое толщина базовая; скролл подкручивает её через --boost.    */}
      <motion.path
        d={busD}
        className="trace-path trace-flow"
        stroke="var(--head)"
        strokeWidth={boostActive ? headWidth : thickness + 0.4}
        fill="none"
        pathLength={1}
        opacity={headOpacity}
        style={{
          ...vars,
          strokeDasharray: `${HEAD} ${BIG}`,
          filter: mobile ? "none" : glow,
        }}
      />
    </g>
  );

  return (
    <>
      {/* Широкий полупрозрачный «псевдо-bloom» — едет вместе с током.        */}
      {/* Мобайл: единственный bloom (фильтров нет). Десктоп: opacity модул.  */}
      <motion.path
        d={busD}
        className="trace-path trace-flow"
        stroke={tailStroke}
        strokeWidth={thickness + 2}
        fill="none"
        pathLength={1}
        style={
          {
            "--flow-dur": flowDur,
            "--flow-delay": flowDelay,
            strokeDasharray: `${TAIL} ${BIG}`,
            opacity: mobile
              ? tailOpacity * 0.35
              : boostActive
                ? bloomOpacity
                : 0.2,
          } as React.CSSProperties
        }
      />

      {/* Hero: голова отдельно «дышит» поверх тока — powered-on на 1-м кадре. */}
      {ambient && (
        <path
          d={busD}
          className="trace-path trace-flow trace-head-ambient"
          stroke="var(--head)"
          strokeWidth={thickness + 0.4}
          fill="none"
          pathLength={1}
          style={
            {
              "--flow-dur": flowDur,
              "--flow-delay": flowDelay,
              strokeDasharray: `${HEAD} ${BIG}`,
              filter: mobile ? "none" : glow,
            } as React.CSSProperties
          }
        />
      )}

      {/* Основной пакет. */}
      {cometSet(flowVars, "p1")}

      {/* Плотность: 2-й пакет на полцикла вперёд (только две горячие секции). */}
      {dense && cometSet(flowVarsHalf, "p2")}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Пайка/узел — HTML-оверлей (skew-safe). Вспышка перетактована на     */
/*  CSS-ток: keyframe с тем же периодом/фазой, что и голова пакета.    */
/* ------------------------------------------------------------------ */

function TraceNode({
  index,
  label,
  side,
  isAccent,
  mobile,
  reduce,
  terminal,
  flowDur,
  flowDelay,
}: {
  index?: string;
  label?: string;
  side: number; // -1 карман слева, +1 справа
  isAccent: boolean;
  mobile: boolean;
  reduce: boolean;
  /** Терминал (Contact): постоянно зажжён + медленное «дыхание»-маяк. */
  terminal: boolean;
  flowDur: string;
  flowDelay: string;
}) {
  // Узел стоит на верхней губе кармана (PAD_Y). Голова пакета проходит её
  // в фазе flowDelay + PAD_Y*flowDur — сдвигаем keyframe-задержку на этот зазор,
  // чтобы вспышка совпала с проходом головы (а не с верхом секции).
  const passDelay = `calc(${flowDelay} + ${flowDur} * ${PAD_Y})`;

  // Reduced-motion: статичная «зажжённая» пайка, без bloom/вспышки/дыхания.
  if (reduce) {
    return (
      <div
        className="absolute flex items-center gap-3"
        style={{
          left: "50%",
          top: `${HY0 / 10}%`,
          transform: "translate(-50%, -50%)",
          flexDirection: side < 0 ? "row-reverse" : "row",
        }}
      >
        <span
          className="block h-3 w-3 rounded-full border"
          style={{
            backgroundColor: "var(--color-accent)",
            borderColor: "var(--color-accent)",
            boxShadow: terminal ? "0 0 12px rgba(255,106,43,0.6)" : "none",
          }}
        />
        {index && !mobile && (
          <span
            className="tech-label whitespace-nowrap"
            style={{ color: "var(--color-fg)" }}
          >
            {index}
            {label ? ` · ${label}` : ""}
          </span>
        )}
      </div>
    );
  }

  // Терминал: постоянный «маяк» — дышит сам по себе, в покое всегда зажжён.
  // Иначе: line-узлы вспыхивают в фазе прохода головы и оседают в OFF;
  // accent-узлы (не терминал) оседают «зажжёнными» через --accent-вариант класса.
  const dotClass = terminal
    ? "trace-beacon"
    : isAccent
      ? "trace-node-flash trace-node-flash--accent"
      : "trace-node-flash";

  const dotVars: React.CSSProperties = terminal
    ? {}
    : ({
        "--flow-dur": flowDur,
        "--flow-delay": passDelay,
      } as React.CSSProperties);

  // Подпись: терминал/accent оседают зажжёнными (fg); line — muted в покое.
  const labelLit = terminal || isAccent;

  return (
    <div
      className="absolute flex items-center gap-3"
      style={{
        left: "50%",
        top: `${HY0 / 10}%`,
        transform: "translate(-50%, -50%)",
        // Подпись висит ГОРИЗОНТАЛЬНО в сторону детура — не наезжает на тип.
        flexDirection: side < 0 ? "row-reverse" : "row",
      }}
    >
      {/* Узел: box-shadow/background/border анимируются прямо в keyframe        */}
      {/* (registered-free) — фаза заперта на CSS-ток, без чтения скролла.       */}
      <span
        className={`block h-3 w-3 rounded-full border ${dotClass}`}
        style={dotVars}
      />
      {/* Моно-подпись — только десктоп (на узком вьюпорте скрыта). */}
      {index && !mobile && (
        <span
          className={`tech-label whitespace-nowrap ${labelLit ? "trace-label-lit" : ""}`}
        >
          {index}
          {label ? ` · ${label}` : ""}
        </span>
      )}
    </div>
  );
}