#[allow(duplicate_alias)]
module sui_betting::settlement {

    use sui_betting::event;
    use sui_betting::constants;
    use sui_betting::errors;

    use sui::tx_context::{TxContext, sender};
    use sui::transfer;

    /// Închide evenimentul (fără să facă settlement economic)
    entry fun close_event(
        event_obj: &mut event::PredictionEvent,
        ctx: &TxContext
    ) {
        // 🔒 doar adminul poate închide evenimentul
        assert!(
            sender(ctx) == constants::admin_address(),
            errors::E_UNAUTHORIZED()
        );

        event::close_event_internal(event_obj);
    }

    /// Admin setează rezultatul final LONG / SHORT
    entry fun set_result_admin(
        event_obj: &mut event::PredictionEvent,
        result_side: u8,
        ctx: &TxContext
    ) {
        // 🔒 doar adminul poate seta rezultatul evenimentului
        assert!(
            sender(ctx) == constants::admin_address(),
            errors::E_UNAUTHORIZED()
        );

        event::set_result_internal(event_obj, result_side);
    }

    /// Marchează evenimentul ca settled (pregătire pentru payout)
    entry fun settle_event(
        event_obj: &mut event::PredictionEvent,
        ctx: &TxContext
    ) {
        // 🔒 doar adminul poate face settlement
        assert!(
            sender(ctx) == constants::admin_address(),
            errors::E_UNAUTHORIZED()
        );

        event::settle_internal(event_obj);
    }

    /// Userul își revendică payout-ul
    entry fun claim_payout(
        event_obj: &mut event::PredictionEvent,
        ctx: &mut TxContext
    ) {
        let caller = sender(ctx);
        let payout = event::claim_internal(event_obj, caller, ctx);
        transfer::public_transfer(payout, caller);
    }
}
