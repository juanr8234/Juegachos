import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase compartido por todos los juegos y la landing para el
 * ranking global. Se crea una sola vez de forma perezosa a partir de las env
 * vars de Vite. Si faltan las credenciales devuelve null, y toda la UI de
 * ranking degrada con gracia (los juegos siguen funcionando con su best local).
 */
let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    client = null;
    return client;
  }

  client = createClient(url, anonKey, {
    auth: { persistSession: false },
  });
  return client;
}

/** True cuando hay credenciales y el ranking global esta disponible. */
export function isLeaderboardEnabled(): boolean {
  return getSupabase() !== null;
}
