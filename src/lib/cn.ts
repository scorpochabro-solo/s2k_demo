/**
 * Крошечный помощник для склейки className без лишних зависимостей.
 * Принимает строки и falsy-значения, отбрасывает пустые.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .filter((v): v is string | number => Boolean(v))
    .join(" ")
    .trim();
}
