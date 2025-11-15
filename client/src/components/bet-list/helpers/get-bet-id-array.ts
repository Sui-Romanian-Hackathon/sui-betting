import { getMoveObj } from './get-move-obj'

export async function getBetIdArray() {
  const betRegistryPromise = getMoveObj(
    '0x133243163b6ee4d234b35e448187a5a7d5e0c70079ffa129bb4aadd220ea5390',
  )

  const betRegistry = await betRegistryPromise

  if (betRegistry === undefined) return []
  return (betRegistry as BetRegistry).events
}
