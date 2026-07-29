import { kv } from "@vercel/kv";
import type { ResultsMap } from "@/data/types";

/**
 * Results live in a single Vercel KV key, written by `/api/results`.
 * Reads are best-effort: if KV is unreachable (or unconfigured, as in local
 * dev) the pages render their empty states rather than erroring.
 */
const RESULTS_KEY = "results";

export async function getResults(): Promise<ResultsMap> {
  try {
    return (await kv.get<ResultsMap>(RESULTS_KEY)) ?? {};
  } catch {
    return {};
  }
}
