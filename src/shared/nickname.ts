const NICKNAME_KEY = "mg:nickname";

export const NICKNAME_MAX = 12;
export const NICKNAME_MIN = 1;

/** Recorta y limita un nombre al rango valido (1-12 chars). */
export function sanitizeNickname(raw: string): string {
  return raw.trim().slice(0, NICKNAME_MAX);
}

/** Nombre guardado del jugador, o null si todavia no eligio uno. */
export function getNickname(): string | null {
  const stored = localStorage.getItem(NICKNAME_KEY);
  if (!stored) return null;
  const clean = sanitizeNickname(stored);
  return clean.length >= NICKNAME_MIN ? clean : null;
}

/** Guarda el nombre saneado. Devuelve el valor guardado o null si es invalido. */
export function setNickname(raw: string): string | null {
  const clean = sanitizeNickname(raw);
  if (clean.length < NICKNAME_MIN) return null;
  localStorage.setItem(NICKNAME_KEY, clean);
  return clean;
}
