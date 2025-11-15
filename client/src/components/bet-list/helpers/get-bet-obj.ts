import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'

export async function getBetObj(betID: string) {
  const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') })

  const betObj = await suiClient.getObject({
    id: betID,
    options: {
      showContent: true,
    },
  })

  const content = betObj?.data?.content
  return content?.dataType === 'moveObject' ? content.fields : undefined
}
