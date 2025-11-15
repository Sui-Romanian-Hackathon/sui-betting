#[allow(lint(coin_field), unused_field)]
module sui_betting::event {

    use std::string;
    use sui::object::new;
    use sui::coin::{Coin, value, join, zero, split};
    use sui::sui::SUI;
    use sui::table;

    use sui_betting::constants;
    use sui_betting::errors;

    /// Pool simplu — totalul mizei pe o parte (LONG / SHORT)
    public struct Pool has store {
        total: u64,
    }

    /// Struct Bet — tracking pariu per user
    public struct Bet has store, drop {
        amount: u64,
        side: u8,
        claimed: bool,
    }

    /// Structura principală PredictionEvent
    public struct PredictionEvent has key, store {
        id: UID,
        description: string::String,
        start_ts: u64,
        end_ts: u64,
        long_pool: Pool,
        short_pool: Pool,
        long_vault: Coin<SUI>,
        short_vault: Coin<SUI>,
        is_closed: bool,
        result_side: u8,
        is_settled: bool,
        bets: table::Table<address, Bet>,
    }

    /// Helper LONG?
    public fun is_long_side(side: u8): bool {
        side == constants::side_long()
    }

    /// Helper SHORT?
    public fun is_short_side(side: u8): bool {
        side == constants::side_short()
    }

    /// Verifică dacă un utilizator poate paria
    public fun assert_can_bet(event: &PredictionEvent, current_time: u64) {
        assert!(!event.is_closed, errors::E_EVENT_CLOSED());
        assert!(current_time < event.start_ts, errors::E_EVENT_STARTED());
    }

    /// Adaugă pariu în pool + vault
    public fun add_bet(
        event: &mut PredictionEvent,
        side: u8,
        stake: Coin<SUI>,
    ) {
        let is_long = is_long_side(side);
        let is_short = is_short_side(side);
        assert!(is_long || is_short, errors::E_INVALID_SIDE());

        let amount = value(&stake);

        if (is_long) {
            join(&mut event.long_vault, stake);
            event.long_pool.total = event.long_pool.total + amount;
        } else {
            join(&mut event.short_vault, stake);
            event.short_pool.total = event.short_pool.total + amount;
        };
    }

    // ---------------------------------------------------------
    //   TRACKING PARIURI PER USER (address -> Bet)
    // ---------------------------------------------------------

    public fun record_bet(
        event: &mut PredictionEvent,
        bettor: address,
        side: u8,
        amount: u64,
    ) {
        let bets_ref = &mut event.bets;

        if (table::contains(bets_ref, bettor)) {
            let existing = table::borrow_mut(bets_ref, bettor);
            assert!(existing.side == side, errors::E_INVALID_SIDE());
            existing.amount = existing.amount + amount;
        } else {
            let bet = Bet { amount, side, claimed: false };
            table::add(bets_ref, bettor, bet);
        };
    }

    // ---------------------------------------------------------
    //          INTERNAL FUNCTIONS FOLOSITE DE settlement.move
    // ---------------------------------------------------------

    public fun close_event_internal(event: &mut PredictionEvent) {
        assert!(!event.is_closed, errors::E_EVENT_CLOSED());
        event.is_closed = true;
    }

    public fun set_result_internal(event: &mut PredictionEvent, result_side: u8) {
        assert!(event.is_closed, errors::E_EVENT_NOT_STARTED());
        assert!(event.result_side == 0, errors::E_ALREADY_SETTLED());

        let is_valid =
            result_side == constants::side_long() ||
            result_side == constants::side_short();
        assert!(is_valid, errors::E_INVALID_SIDE());

        event.result_side = result_side;
    }

    public fun has_result(event: &PredictionEvent): bool {
        event.result_side != 0
    }

    public fun is_settled(event: &PredictionEvent): bool {
        event.is_settled
    }

    public fun settle_internal(event: &mut PredictionEvent) {
        assert!(event.result_side != 0, errors::E_NO_RESULT());
        assert!(!event.is_settled, errors::E_ALREADY_SETTLED());
        event.is_settled = true;
    }

    /// CLAIM intern — întoarce payout Coin<SUI> către settlement.move
    public fun claim_internal(
        event: &mut PredictionEvent,
        user: address,
        ctx: &mut sui::tx_context::TxContext
    ): Coin<SUI> {

        assert!(event.is_settled, errors::E_EVENT_NOT_STARTED());
        assert!(table::contains(&event.bets, user), errors::E_NOTHING_TO_CLAIM());

        let bet_ref = table::borrow_mut(&mut event.bets, user);
        assert!(!bet_ref.claimed, errors::E_ALREADY_CLAIMED());
        assert!(bet_ref.side == event.result_side, errors::E_NOTHING_TO_CLAIM());

        let user_amount = bet_ref.amount;

        // winner_pool, loser_pool, winner_vault, _loser_vault
        let (winner_pool, loser_pool, winner_vault, _loser_vault) =
            if (event.result_side == constants::side_long()) {
                (
                    event.long_pool.total,
                    event.short_pool.total,
                    &mut event.long_vault,   // folosit mutabil (split)
                    &event.short_vault       // DOAR read, fără mut
                )
            } else {
                (
                    event.short_pool.total,
                    event.long_pool.total,
                    &mut event.short_vault,  // folosit mutabil (split)
                    &event.long_vault        // DOAR read, fără mut
                )
            };

        // Formula payout = user_amount + (user_amount * loser_pool / winner_pool)
        let bonus = user_amount * loser_pool / winner_pool;
        let payout_total = user_amount + bonus;

        // split din vault-ul câștigător
        let payout_coin = split(winner_vault, payout_total, ctx);

        // marchează payout-ul ca luat
        bet_ref.claimed = true;

        payout_coin
    }

    /// Constructor PredictionEvent
    public fun new_prediction_event(
        description: string::String,
        start_ts: u64,
        end_ts: u64,
        ctx: &mut sui::tx_context::TxContext,
    ): PredictionEvent {

        let long_pool = Pool { total: 0 };
        let short_pool = Pool { total: 0 };

        let long_vault: Coin<SUI> = zero(ctx);
        let short_vault: Coin<SUI> = zero(ctx);

        let bets = table::new<address, Bet>(ctx);

        PredictionEvent {
            id: new(ctx),
            description,
            start_ts,
            end_ts,
            long_pool,
            short_pool,
            long_vault,
            short_vault,
            is_closed: false,
            result_side: 0,
            is_settled: false,
            bets,
        }
    }
}
