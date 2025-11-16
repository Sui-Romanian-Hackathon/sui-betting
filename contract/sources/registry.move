//contract/sources/registry.move

#[allow(duplicate_alias)]
module sui_betting::registry {

    use sui::object::{UID, new};
    use sui::tx_context::TxContext;
    use std::vector;
    use sui::object;
    use sui::transfer;

    /// 🔥 Registry — ține lista tuturor PredictionEvent IDs
    public struct Registry has key, store {
        id: UID,
        events: vector<object::ID>,
    }

    /// 🚀 Init — creează un registry nou, shared
    entry fun init_registry(ctx: &mut TxContext) {
        let reg = Registry {
            id: new(ctx),
            events: vector::empty<object::ID>(),
        };

        // Transformă obiectul în shared object
        transfer::share_object(reg);
    }

    /// 🔥 Folosită de factory.create_event() pentru a adăuga un nou event
    public fun add_event(registry: &mut Registry, event_id: object::ID) {
        vector::push_back(&mut registry.events, event_id);
    }
}
