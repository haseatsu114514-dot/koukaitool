/** Storage key for the derived result (never the birth date). Kept dependency-free so the always-loaded tab bar can check it without pulling in zod. */
export const RESULT_KEY = "stella-result-v1";

/** True when this browser holds a saved result. Earlier versions kept it in sessionStorage, which is still read once and moved over. */
export function hasStoredResult(): boolean {
  try { return localStorage.getItem(RESULT_KEY) !== null || sessionStorage.getItem(RESULT_KEY) !== null; } catch { return false; }
}
