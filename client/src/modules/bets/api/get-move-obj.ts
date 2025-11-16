//client/src/components/bet-list/helpers/get-move-obj.ts

import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export async function getMoveObj(id: string) {
  try {
    console.log("Fetching ID:", id);

    const res = await client.getObject({
      id,
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
        showBcs: true,
      },
    });

    console.log("RAW RESPONSE:", JSON.stringify(res, null, 2));

    if (!res.data) {
      console.log("NO DATA FIELD");
      return null;
    }

    if (!res.data.content) {
      console.log("NO CONTENT FIELD");
      return null;
    }

    if (res.data.content.dataType !== "moveObject") {
      console.log("NOT A MOVE OBJECT – TYPE:", res.data.content.dataType);
      return null;
    }

    console.log("RETURN FIELDS:", res.data.content.fields);
    return res.data.content.fields;

  } catch (e) {
    console.error("Error fetching move object:", e);
    return null;
  }
}
