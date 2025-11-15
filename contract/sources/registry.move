#[allow(duplicate_alias)]
module sui_betting::registry {

    use sui::object::{ID, new};
    use sui::transfer;

    /// Lista globală de PredictionEvent-uri
    public struct Registry has key, store {
        id: UID,
        events: vector<ID>,
    }

    /// Creează registry-ul global (o singură dată)
    entry fun init_registry(ctx: &mut sui::tx_context::TxContext) {
        let registry = Registry {
            id: new(ctx),
            events: vector::empty<ID>(),
        };

        transfer::share_object(registry);
    }

    /// Adaugă un eveniment nou
    public fun add_event(registry: &mut Registry, event_id: ID) {
        vector::push_back(&mut registry.events, event_id);
    }

    /// Returnează lista ID-urilor
    public fun get_events(registry: &Registry): &vector<ID> {
        &registry.events
    }
}
