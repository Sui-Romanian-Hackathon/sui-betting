//contract/sources/factory.move

#[allow(duplicate_alias)]
module sui_betting::factory {

    use std::string;
    use sui::object;
    use sui::transfer;
    use sui::tx_context::{TxContext, sender};

    use sui_betting::event;
    use sui_betting::registry;
    use sui_betting::errors;
    use sui_betting::constants;

    /// Creează un PredictionEvent nou și îl adaugă în Registry
    entry fun create_event(
        registry_obj: &mut registry::Registry,

        description: string::String,
        start_ts: u64,
        end_ts: u64,

        ctx: &mut TxContext,
    ) {
        //
        // 🔥 DOAR ADMINUL POATE CREA EVENIMENTE
        //
        assert!(
            sender(ctx) == constants::admin_address(),
            errors::E_UNAUTHORIZED()
        );

        //
        // Validare timp
        //
        assert!(end_ts > start_ts, errors::E_EVENT_NOT_STARTED());

        //
        // Creează obiectul PredictionEvent
        //
        let event_obj = event::new_prediction_event(
            description,
            start_ts,
            end_ts,
            ctx,
        );

        //
        // Luăm ID-ul obiectului
        //
        let event_id = object::id(&event_obj);

        //
        // Adăugăm în Registry
        //
        registry::add_event(registry_obj, event_id);

        //
        // Permite acces global la eveniment
        //
        transfer::public_share_object(event_obj);
    }
}
