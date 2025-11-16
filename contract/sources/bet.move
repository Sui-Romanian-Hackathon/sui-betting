//contract/sources/bet.move

#[allow(duplicate_alias)]
module sui_betting::bet {

	use sui::coin::{Coin, value};
	use sui::sui::SUI;
	use sui::tx_context::{TxContext, sender};

	use sui_betting::event;
	use sui_betting::constants;

	/// Entry-point general: pariu LONG sau SHORT
	entry fun place_bet(
		event_obj: &mut event::PredictionEvent,
		side: u8,
		stake: Coin<SUI>,
		current_time: u64,
		ctx: &TxContext,
	) {
		// 0) Calculăm amount-ul din stake, pentru tracking per user
		let amount = value(&stake);

		// 1) Validăm că evenimentul este deschis și încă nu a început
		event::assert_can_bet(event_obj, current_time);

		// 2) Adăugăm pariul în pool + vault corect
		event::add_bet(event_obj, side, stake);

		// 3) Înregistrăm / actualizăm bet-ul userului în tabelul bets
		let bettor = sender(ctx);
		event::record_bet(event_obj, bettor, side, amount);
	}

	/// 🔵 Helper: pariu LONG (side = 1)
	entry fun bet_long(
		event_obj: &mut event::PredictionEvent,
		stake: Coin<SUI>,
		current_time: u64,
		ctx: &TxContext,
	) {
		place_bet(
			event_obj,
			constants::side_long(),
			stake,
			current_time,
			ctx
		);
	}

	/// 🔴 Helper: pariu SHORT (side = 2)
	entry fun bet_short(
		event_obj: &mut event::PredictionEvent,
		stake: Coin<SUI>,
		current_time: u64,
		ctx: &TxContext,
	) {
		place_bet(
			event_obj,
			constants::side_short(),
			stake,
			current_time,
			ctx
		);
	}
}
