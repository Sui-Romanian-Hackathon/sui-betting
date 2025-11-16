// client/src/components/bet-list/modals/place-bet.tsx

'use client'

import { useState, useEffect } from 'react'
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";

type PlaceBetPopupProps = {
  bet: BetObj
  option: 'yes' | 'no'
  maxBalance: number
  onClose: () => void
}

const PACKAGE_ID = "0x8fcc86d396abd6a468be3bcccfa9a02b0693319ae645389d561ec8012412fa71";

export default function PlaceBetPopup({ bet, option, maxBalance, onClose }: PlaceBetPopupProps) {
  const [amount, setAmount] = useState(10);

  // NEW STATES:
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Wallet hooks
  const account = useCurrentAccount();
  const signAndExecute = useSignAndExecuteTransaction();

  const handlePlaceBet = async () => {
    if (!account) {
      setStatus("error");
      setErrorMessage("Wallet not connected.");
      return;
    }

    try {
      setStatus("loading");

      const betSide = option === 'yes' ? 1 : 2;
      const timestamp = Math.floor(Date.now() / 1000);
      const mist = BigInt(Math.floor(amount * 1_000_000_000));

      // Build transaction
      const tx = new Transaction();
      const stakeCoin = tx.splitCoins(tx.gas, [tx.pure.u64(mist)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::bet::place_bet`,
        arguments: [
          tx.object(bet.id.id),
          tx.pure.u8(betSide),
          stakeCoin,
          tx.pure.u64(timestamp),
        ],
      });

      console.log("➡️ Sending transaction to blockchain...");
      const result = await signAndExecute.mutateAsync({
        transaction: tx,
      });

      console.log("✅ TX SUCCESS:", result);

      setStatus("success");

      // Close popup after 1 second
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err: any) {
      console.error("❌ TX FAILED:", err);
      setStatus("error");
      setErrorMessage(err?.message ?? "Transaction failed.");
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value) || 0;
    if (v <= maxBalance) setAmount(v);
  };

  const handleQuickAmount = (v: number) => setAmount(v);

  const potentialPayout = amount * 1.95;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm overflow-hidden"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[250px]">
                {bet.description}
              </h3>
              <span className={`text-sm font-semibold ${
                option === 'yes'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                Betting on: {option.toUpperCase()}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              ✕
            </button>
          </div>

          {/* SUCCESS MESSAGE */}
          {status === "success" && (
            <div className="mb-4 rounded-lg border border-emerald-500 bg-emerald-500/20 text-emerald-200 px-3 py-2 text-sm text-center animate-pulse">
              ✅ Bet placed successfully!
            </div>
          )}

          {/* ERROR MESSAGE */}
          {status === "error" && (
            <div className="mb-4 rounded-lg border border-red-500 bg-red-500/20 text-red-200 px-3 py-2 text-sm text-center">
              ❌ {errorMessage}
            </div>
          )}

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-2">
              Amount (SUI)
            </label>
            <input
              type="number"
              min="0"
              max={maxBalance}
              step="0.1"
              value={amount}
              onChange={handleAmountChange}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>

          {/* Slider */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={maxBalance}
              step="0.001"
              value={amount}
              onChange={handleSliderChange}
              className="w-full h-2 rounded-lg cursor-pointer bg-zinc-200 dark:bg-zinc-700"
            />
            <div className="flex justify-between mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              <span>0 SUI</span>
              <span>{maxBalance.toFixed(2)} SUI</span>
            </div>
          </div>

          {/* Quick buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[0.1, 0.25, 0.5, 1].map(p => (
              <button
                key={p}
                onClick={() => handleQuickAmount(maxBalance * p)}
                className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {p === 1 ? 'Max' : `${p * 100}%`}
              </button>
            ))}
          </div>

          {/* Submit button */}
          <button
            onClick={handlePlaceBet}
            disabled={amount > maxBalance || status === "loading"}
            className={`w-full rounded-xl px-7 py-4 text-center font-bold text-white shadow-lg transition-all ${
              option === 'yes'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
          >
            {status === "loading" ? "Processing..." : <>
              <div className="text-xs uppercase tracking-wider opacity-90">Place Bet</div>
              <div className="text-2xl mt-1">{potentialPayout.toFixed(2)} SUI</div>
            </>}
          </button>

        </div>
      </div>
    </>
  )
}
