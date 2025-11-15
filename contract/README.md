# Documentație Contract Sui Prediction Market

## Prezentare Generală

Acest proiect implementează un sistem complet de prediction market pe blockchain-ul **Sui**, permițând utilizatorilor să plaseze pariuri pe direcția unui eveniment (LONG / SHORT), iar după publicarea rezultatului, câștigătorii își pot revendica payout-ul proporțional cu miza investită.

Contractul este modular, ușor de extins și construit astfel încât frontend-ul (React + TypeScript) să îl poată folosi fără dificultate.

---

## Structura proiectului

Smart-contract-ul conține următoarele module:

| Fișier | Conținut | Responsabilitate |
|--------|----------|------------------|
| **constants.move** | side_long, side_short, admin_address | Setări globale și adresa adminului |
| **errors.move** | coduri de eroare | Validări standard |
| **event.move** | structuri + logică eveniment | Pariuri, pool-uri, payout, claim_internal |
| **bet.move** | place_bet() | Entry point pentru utilizatori |
| **settlement.move** | close, set_result, settle, claim_payout | Control admin și payout |
| **factory.move** | create_event | Admin creează evenimente |
| **registry.move** | struct Registry | Listă globală cu toate evenimentele |

---

## Structuri importante

### PredictionEvent
Reprezintă un eveniment complet:

- perioadă (start/end)
- descriere
- două pool-uri financiare (LONG / SHORT)
- două vault-uri Coin<SUI> unde se adună stake-urile
- tabel cu pariuri `address → Bet`
- status: închis, rezultat, settled

### Bet
Pentru fiecare utilizator:

- **amount**: suma pariată
- **side**: 1 = LONG, 2 = SHORT
- **claimed**: dacă payout-ul a fost revendicat

### Registry
Obiect global ce stochează ID-urile tuturor PredictionEvent-urilor.

---

## Funcționalități principale

### 1. Admin creează un eveniment
Prin `factory::create_event`, se generează un `PredictionEvent` și se adaugă în `Registry`.

### 2. Utilizatorii pot paria LONG / SHORT
Prin `bet::place_bet`, orice utilizator trimite un Coin<SUI> și își înregistrează pariul.

### 3. Admin închide evenimentul
După ce perioada de pariere s-a încheiat.

### 4. Admin setează rezultatul
LONG (1) sau SHORT (2).

### 5. Admin marchează evenimentul ca settled
Activează posibilitatea utilizatorilor de a revendica payout-ul.

### 6. Utilizatorii revendică payout
Prin `settlement::claim_payout`, payout-ul se calculează proporțional:
```
payout = user_amount + user_amount * (loser_pool / winner_pool)
```

---

## Utilizare în Frontend (React + TS)

Pentru a integra contractul, frontend-ul va trebui să facă următoarele:

### 1. Citească Registry-ul
De aici ia lista ID-urilor de evenimente.

```ts
client.getObject({ id: registryId, options: { showContent: true }});
```

### 2. Citească PredictionEvent-urile
Pentru fiecare ID din registry:

```ts
client.getObject({ id: eventId, options: { showContent: true }});
```

### 3. Plasarea unui pariu

```ts
tx.moveCall({
  target: "sui_betting::bet::place_bet",
  arguments: [
    tx.object(eventId),
    tx.pure(side), // 1 = LONG, 2 = SHORT
    tx.object(stakeCoin),
    tx.pure(Date.now() / 1000) // current_time
  ],
});
```

### 4. Operațiuni Admin
- `close_event`
- `set_result_admin`
- `settle_event`

Exemplu:

```ts
tx.moveCall({
  target: "sui_betting::settlement::set_result_admin",
  arguments: [
    tx.object(eventId),
    tx.pure(resultSide)
  ],
});
```

### 5. Claim payout

```ts
tx.moveCall({
  target: "sui_betting::settlement::claim_payout",
  arguments: [ tx.object(eventId) ],
});
```

---

## Tipuri recomandate pentru Frontend

```ts
export interface Bet {
  amount: number;
  side: number;
  claimed: boolean;
}

export interface PredictionEvent {
  id: string;
  description: string;
  start_ts: number;
  end_ts: number;
  long_pool: { total: number };
  short_pool: { total: number };
  long_vault: string;
  short_vault: string;
  is_closed: boolean;
  result_side: number;
  is_settled: boolean;
  bets: Record<string, Bet>;
}
```

---

## Concluzie

Contractul Sui Prediction Market este complet funcțional și acoperă:

- creare evenimente
- pariere multi-user
- administrare evenimente
- calcul payout proporțional
- claim individual

Frontend-ul se poate integra rapid folosind `SuiClient`, `TransactionBlock` și funcțiile expuse în module.

---
