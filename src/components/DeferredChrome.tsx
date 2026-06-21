"use client";

import dynamic from "next/dynamic";

// Декоративные, не нужны на первом кадре → грузим после гидрации (ssr:false),
// чтобы не тянуть их JS (и Framer) в критический путь. Лучший FCP/LCP/TBT.
const Preloader = dynamic(() => import("./Preloader"), { ssr: false });
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });

export default function DeferredChrome() {
  return (
    <>
      <Preloader />
      <Cursor />
    </>
  );
}
