'use client'

import { useState, useEffect } from 'react'
import { generateSpinResult, WHEEL_SEGMENTS, type SpinResult } from './spin-logic'

type JackpotSpinModalProps = {
  betAmount: number
  potentialPayout: number
  onClose: (finalPayout: number, multiplier: number) => void
}

export default function JackpotSpinModal({ betAmount, potentialPayout, onClose }: JackpotSpinModalProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<SpinResult | null>(null)
  const [rotation, setRotation] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Play click sound effect (simplified with Web Audio API)
  const playClickSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'square'
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.05)
  }

  // Play ding sound for result
  const playDingSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 1200
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  const handleSpin = () => {
    setIsSpinning(true)
    setShowResult(false)
    
    // Generate result
    const spinResult = generateSpinResult()
    
    // Calculate rotations (5-7 full spins + landing position)
    const fullSpins = 5 + Math.random() * 2
    const segmentAngle = 360 / WHEEL_SEGMENTS.length
    const resultIndex = WHEEL_SEGMENTS.findIndex(s => s.multiplier === spinResult.multiplier && s.isJackpot === spinResult.isJackpot)
    const targetAngle = resultIndex * segmentAngle
    const totalRotation = fullSpins * 360 + targetAngle

    setRotation(totalRotation)

    // Play clicking sounds during spin
    const clickInterval = setInterval(() => {
      playClickSound()
    }, 100)

    // Stop after spin completes
    setTimeout(() => {
      clearInterval(clickInterval)
      playDingSound()
      setIsSpinning(false)
      setResult(spinResult)
      setShowResult(true)
    }, 3000)
  }

  const handleDismiss = () => {
    const appliedMultiplier = result?.multiplier ?? 1
    const finalPayout = potentialPayout * appliedMultiplier
    onClose(finalPayout, appliedMultiplier)
  }

  const finalPayout = result ? potentialPayout * result.multiplier : potentialPayout

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto relative w-full max-w-lg rounded-3xl border-2 border-yellow-400 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-full border border-white/30 px-3 py-0.5 text-sm text-white/80 transition hover:border-white hover:text-white"
          >
            ✕
          </button>
          
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-yellow-400 drop-shadow-lg animate-pulse">
              🎰 SUI JACKPOT SPIN 🎰
            </h2>
            <p className="text-white/80 mt-2 text-sm">
              Spin for a chance to multiply your winnings!
            </p>
            <p className="mt-1 text-xs text-white/60">
              Stake: {betAmount.toFixed(2)} SUI • Base payout: {potentialPayout.toFixed(2)} SUI
            </p>
          </div>

          {/* Wheel Container */}
          <div className="relative mb-8">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
            </div>

            {/* Wheel */}
            <div className="relative w-72 h-72 mx-auto">
              <div 
                className="w-full h-full rounded-full border-8 border-yellow-400 shadow-2xl transition-transform duration-3000 ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(from 0deg, #ef4444 0deg 30deg, #f59e0b 30deg 60deg, #10b981 60deg 90deg, #3b82f6 90deg 120deg, #8b5cf6 120deg 150deg, #ec4899 150deg 180deg, #ef4444 180deg 210deg, #f59e0b 210deg 240deg, #10b981 240deg 270deg, #3b82f6 270deg 300deg, #8b5cf6 300deg 330deg, #fbbf24 330deg 360deg)'
                }}
              >
                {/* Segments with labels */}
                {WHEEL_SEGMENTS.map((segment, index) => {
                  const angle = (360 / WHEEL_SEGMENTS.length) * index
                  return (
                    <div
                      key={index}
                      className="absolute top-1/2 left-1/2 origin-left"
                      style={{
                        transform: `rotate(${angle}deg) translateX(80px)`,
                        width: '60px',
                      }}
                    >
                      <div 
                        className={`text-white font-bold text-sm text-center ${segment.isJackpot ? 'text-yellow-300 text-lg' : ''}`}
                        style={{ transform: 'rotate(90deg)' }}
                      >
                        {segment.label}
                      </div>
                    </div>
                  )
                })}

                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl">🎲</span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Display */}
          {showResult && result && (
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400 animate-in fade-in zoom-in duration-500">
              <div className="text-center">
                <div className={`text-5xl font-bold mb-2 ${result.isJackpot ? 'text-yellow-300 animate-bounce' : 'text-white'}`}>
                  {result.label}
                </div>
                {result.isJackpot && (
                  <div className="text-2xl mb-3 animate-pulse">
                    🎉 JACKPOT! 🎉
                  </div>
                )}
                <div className="text-white/90 text-lg">
                  Your winnings: <span className="font-bold text-yellow-300">{finalPayout.toFixed(2)} SUI</span>
                </div>
                <div className="text-white/70 text-sm mt-1">
                  Base payout: {potentialPayout.toFixed(2)} SUI × {result.multiplier}x
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {!isSpinning && !showResult && (
              <button
                onClick={handleSpin}
                className="flex-1 rounded-xl px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
              >
                🎰 Spin Now
              </button>
            )}

            {isSpinning && (
              <button
                disabled
                className="flex-1 rounded-xl px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold text-lg shadow-lg opacity-70"
              >
                Spinning...
              </button>
            )}

          </div>

          {/* Info text */}
          {!showResult && (
            <div className="mt-4 text-center text-white/60 text-xs">
              {isSpinning ? 'Spinning...' : 'Click to spin the wheel and multiply your winnings!'}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
