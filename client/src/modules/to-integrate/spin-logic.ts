/**
 * SUI Jackpot Spin Logic
 * Generates random multipliers for bet winnings
 */

export type SpinResult = {
  multiplier: number
  label: string
  isJackpot: boolean
}

/**
 * Generates a random multiplier based on probability ranges
 * Uses current timestamp + Math.random() for pseudo-randomness
 */
export function generateSpinResult(): SpinResult {
  // Combine timestamp and random for better randomness
  const timestamp = Date.now()
  const random = Math.random()
  const seed = (timestamp * random) % 100
  const roll = Math.floor(seed)

  // Probability distribution:
  // 1-70: 1x (70% - most common)
  // 71-85: 1.1x (15% - common)
  // 86-95: 1.5x (10% - rare)
  // 96-99: 2x (4% - very rare)
  // 100: 10x (1% - jackpot)

  if (roll <= 70) {
    return {
      multiplier: 1.0,
      label: '1x',
      isJackpot: false
    }
  } else if (roll <= 85) {
    return {
      multiplier: 1.1,
      label: '1.1x',
      isJackpot: false
    }
  } else if (roll <= 95) {
    return {
      multiplier: 1.5,
      label: '1.5x',
      isJackpot: false
    }
  } else if (roll <= 99) {
    return {
      multiplier: 2.0,
      label: '2x',
      isJackpot: false
    }
  } else {
    return {
      multiplier: 10.0,
      label: '10x JACKPOT!',
      isJackpot: true
    }
  }
}

/**
 * All possible multipliers for the wheel display
 */
export const WHEEL_SEGMENTS: SpinResult[] = [
  { multiplier: 1.0, label: '1x', isJackpot: false },
  { multiplier: 1.1, label: '1.1x', isJackpot: false },
  { multiplier: 1.0, label: '1x', isJackpot: false },
  { multiplier: 1.5, label: '1.5x', isJackpot: false },
  { multiplier: 1.0, label: '1x', isJackpot: false },
  { multiplier: 1.1, label: '1.1x', isJackpot: false },
  { multiplier: 1.0, label: '1x', isJackpot: false },
  { multiplier: 2.0, label: '2x', isJackpot: false },
  { multiplier: 1.0, label: '1x', isJackpot: false },
  { multiplier: 1.1, label: '1.1x', isJackpot: false },
  { multiplier: 1.0, label: '1x', isJackpot: false },
  { multiplier: 10.0, label: '10x', isJackpot: true },
]
