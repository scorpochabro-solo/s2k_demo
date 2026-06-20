# S2K Studio — «Трассировка»

Премиум-сайт студии разработки S2K Studio. Арт-направление «Трассировка»: тёмное
поле, инженерная сетка, сигнатурная линия-«магистраль», прорисовывающаяся по скроллу.

**Стек:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 (CSS-токены) ·
Framer Motion · Lenis · `next/font` (Geologica / Onest / JetBrains Mono) · `next/image` · `next/og`.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000 (в этом окружении — порт 3080)
npm run build    # прод-сборка
npm start        # запуск собранного
```

## Структура

```
src/
  app/
    layout.tsx              # шрифты, метаданные, JSON-LD, шапка/футер, прелоадер, курсор
    page.tsx                # главная (сборка секций + FAQ JSON-LD)
    [landing]/page.tsx      # 5 SEO-лендингов (root-слаги из content.ts)
    work/page.tsx           # /work — все работы с фильтром
    work/[slug]/page.tsx    # детальная кейса (SSG по id)
    privacy/page.tsx        # политика ПДн (152-ФЗ)
    api/lead/route.ts       # приём заявок (адаптер канала)
    opengraph-image.tsx     # фирменный og 1200×630 (next/og)
    sitemap.ts robots.ts manifest.ts icon.svg
  components/
    Trace.tsx               # СИГНАТУРНАЯ МАГИСТРАЛЬ (per-section SVG, pathLength)
    SmoothScroll.tsx        # Lenis + scrollTo по якорям (с офсетом шапки)
    Header / Footer / Preloader / Cursor
    sections/*              # секции главной
    ui/*                    # MagneticButton, Reveal, CountUp
  lib/
    content.ts              # SINGLE SOURCE OF TRUTH — весь контент сайта
    seo.tsx                 # метаданные + JSON-LD
```

## Контент — `src/lib/content.ts`

Весь текст, услуги, кейсы, калькулятор, FAQ и SEO-лендинги живут в одном файле.
Правки контента — только здесь.

## Как добавить кейс за 10 минут

1. Открыть `src/lib/content.ts`.
2. Добавить объект в `products` (собственный AI-продукт) или `projects` (клиентский):
   ```ts
   { id: "novyy-keys", category: "Короткое направление",
     name: "Название", description: "Задача → решение → результат (1–3 фразы).",
     stack: ["React", "Python"] }
   ```
3. `id` становится URL: `/work/novyy-keys` (генерируется автоматически, SSG).
4. Чтобы вывести на главную — добавить `id` в массив `FEATURED` в
   `src/components/sections/Work.tsx`.
5. Медиа (когда появится) класть в `public/projects/<id>/` и подключать в
   `work/[slug]/page.tsx` вместо заглушки-схемы.

## Канал приёма заявок

`src/app/api/lead/route.ts`, функция `deliver()`. Сейчас: если заданы переменные
окружения — шлёт в Telegram, иначе логирует лид в консоль сервера.

Подключить боевой Telegram-канал — задать в `.env.local`:
```
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=-1001234567890
```
Для SMTP/CRM — дописать ветку в `deliver()` (интерфейс уже изолирован).

## Аналитика

Яндекс.Метрика ID и GA4 ID хранятся в `site` (`content.ts`): `yandexMetrikaId`,
`ga4Id`. Метрика `108470061` указана. Подключение скриптов аналитики — TODO
(вставить в `layout.tsx` через `next/script` по готовности ID).

## Медиа-пайплайн (когда заказчик пришлёт материалы)

Сейчас реального медиа по кейсам нет — блоки построены типографикой. План пайплайна:

- **Фото (sharp):** исходники → AVIF + WebP + JPEG, ширины 640/1080/1600/2400;
  `next/image` с `sizes`, hero `priority`, `blurDataURL` (LQIP), `width/height` (нулевой CLS).
- **Видео (ffmpeg):** H.264 MP4 (`-crf 24 -preset slow -movflags +faststart`) + WebM;
  постер-кадр; `autoplay muted loop playsinline preload="metadata"`; пауза вне вьюпорта;
  hero ≤ 10–12 МБ, секционные ≤ 6 МБ, мобильные 720p.

Скрипты конвертации (`scripts/`) добавляются вместе с первыми материалами.

## Доступность и производительность

- Тёмная тема, контраст ≥ 4.5:1 (мелкий оранжевый — `--accent-soft`), видимый focus,
  skip-link, `aria` у бургера/табов/формы, декоративная магистраль `aria-hidden`.
- Анимации только `transform/opacity` (+ `stroke-dashoffset` для трассы), reduced-motion
  отключает прорисовку/parallax/marquee, выводит счётчики сразу, трассу — статикой.
- Состояние гонок и блокеры контента — см. `TODO.md`. Lighthouse-отчёт — прогнать на проде.
