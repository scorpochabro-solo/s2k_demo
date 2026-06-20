"use client";

import Link from "next/link";
import { useState } from "react";
import { budgetOptions, contactSection } from "@/lib/content";

type State = "idle" | "loading" | "success" | "error";

/** Форма брифа: валидация, honeypot, согласие ПДн (по умолчанию снято). */
export default function BriefForm() {
  const [state, setState] = useState<State>("idle");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company) return; // honeypot заполнен — бот
    if (!consent) return;
    // ponytail: статический демо без бэкенда — оптимистичный success.
    // Боевой канал: вернуть POST /api/lead (см. git-историю) на Vercel/VPS.
    setState("success");
    form.reset();
    setConsent(false);
  }

  if (state === "success") {
    return (
      <div className="flex h-full flex-col justify-center border border-line bg-bg p-10 text-center">
        <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-accent font-mono text-white">
          ✓
        </span>
        <h3 className="font-display text-2xl">{contactSection.successTitle}</h3>
        <p className="mt-3 text-sm text-muted">{contactSection.successText}</p>
      </div>
    );
  }

  const field =
    "w-full border border-line bg-transparent px-4 py-3.5 text-sm text-fg placeholder:text-muted/70 transition-colors focus:border-accent-soft focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="tech-label mb-2 block">Имя *</span>
          <input name="name" required placeholder="Как к вам обращаться" className={field} />
        </label>
        <label className="block">
          <span className="tech-label mb-2 block">Контакт *</span>
          <input
            name="contact"
            required
            placeholder="Email или @telegram"
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className="tech-label mb-2 block">Бюджет / тип проекта</span>
        <select name="budget" className={`${field} appearance-none`} defaultValue="">
          <option value="" disabled>
            Выберите ориентир
          </option>
          {budgetOptions.map((b) => (
            <option key={b} value={b} className="bg-bg">
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="tech-label mb-2 block">Сообщение *</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Коротко о задаче: что хотите получить и зачем"
          className={`${field} resize-none`}
        />
      </label>

      <label className="flex cursor-pointer items-start gap-3 pt-1 text-xs leading-relaxed text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
        />
        <span>
          Согласен на обработку персональных данных в соответствии с{" "}
          <Link href="/privacy" className="text-accent-soft underline underline-offset-2">
            политикой конфиденциальности
          </Link>
          .
        </span>
      </label>

      {state === "error" && (
        <p role="alert" className="font-mono text-xs text-accent-soft">
          {contactSection.errorText}
        </p>
      )}

      <button
        type="submit"
        disabled={!consent || state === "loading"}
        className="group inline-flex w-full items-center justify-center gap-3 bg-accent px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {state === "loading" ? "Отправляем…" : contactSection.submitLabel}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}
