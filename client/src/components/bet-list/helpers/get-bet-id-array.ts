//client/src/components/bet-list/helpers/get-bet-id-array.ts

import { getMoveObj } from "./get-move-obj";

const REGISTRY_ID =
  "0x425464a95187b8063ea1768457c6dcd93a49d640f6331e6ab52fbd7147a50fb3";

export async function getBetIdArray(): Promise<string[]> {
  const registry = await getMoveObj(REGISTRY_ID);

  if (!registry || !registry.events) {
    return [];
  }

  return registry.events as string[];
}
