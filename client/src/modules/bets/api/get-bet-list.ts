//client/src/components/bet-list/helpers/get-bet-list.ts

import { getMoveObj } from "./get-move-obj";
import { getBetIdArray } from "./get-bet-id-array";

export async function getBetList() {
  const ids = await getBetIdArray();

  const events = await Promise.all(ids.map((id) => getMoveObj(id)));

  return events.filter(Boolean);
}
