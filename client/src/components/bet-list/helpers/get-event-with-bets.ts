import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export async function getEventWithBets(eventId: string) {
  // 1) Fetch main event object
  const res = await client.getObject({
    id: eventId,
    options: {
      showContent: true,
      showType: true,
      showOwner: true,
      showBcs: true,
    },
  });

  if (!res.data) return null;
  const fields = res.data.content?.fields;
  if (!fields) return null;

  // 2) TABLE HANDLE pentru bets
  const betsTableId = fields.bets.fields.id.id;

  // 3) Fetch lista de dynamic fields (cheile din tabel)
  const dynamic = await client.getDynamicFields({
    parentId: betsTableId,
  });

  // 4) Fetch fiecare bet
  const bettors: any[] = [];

  for (const entry of dynamic.data) {
    const keyAddress = entry.name.value; // address bettor

    const obj = await client.getObject({
      id: entry.objectId,
      options: { showContent: true },
    });

    const betFields = obj.data?.content?.fields?.value?.fields;

    bettors.push({
      address: keyAddress,
      amount: betFields.amount,
      side: betFields.side,
      claimed: betFields.claimed,
    });
  }

  return { event: fields, bettors };
}
