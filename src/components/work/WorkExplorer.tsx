"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products, projects, type PortfolioItem } from "@/lib/content";

type Filter = "all" | "products" | "projects";

const TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "products", label: "Продукты" },
  { id: "projects", label: "Проекты" },
];

export default function WorkExplorer() {
  const [filter, setFilter] = useState<Filter>("all");

  const tagged = [
    ...products.map((p) => ({ item: p, kind: "products" as const })),
    ...projects.map((p) => ({ item: p, kind: "projects" as const })),
  ];
  const list = tagged.filter((t) => filter === "all" || t.kind === filter);

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Фильтр работ">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={filter === t.id}
            onClick={() => setFilter(t.id)}
            className={`border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
              filter === t.id
                ? "border-accent bg-accent text-white"
                : "border-line text-muted hover:border-accent-soft hover:text-fg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map(({ item, kind }) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card item={item} kind={kind} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Card({ item, kind }: { item: PortfolioItem; kind: "products" | "projects" }) {
  return (
    <Link
      href={`/work/${item.id}`}
      data-cursor="focus"
      className="group flex h-full flex-col gap-5 bg-bg p-7 transition-colors duration-300 hover:bg-bg-elevated"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-soft">
          {kind === "products" ? "Продукт" : "Проект"}
        </span>
        <span aria-hidden className="font-mono text-xs text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">
          ↗
        </span>
      </div>
      <h2 className="font-display text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
        {item.name}
      </h2>
      <p className="text-xs leading-relaxed text-muted">{item.category}</p>
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {item.stack.slice(0, 4).map((t) => (
          <li key={t} className="border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
            {t}
          </li>
        ))}
      </ul>
    </Link>
  );
}
