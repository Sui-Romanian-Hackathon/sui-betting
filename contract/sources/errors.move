//contract/sources/errors.move

#[allow(unused_const)]
module sui_betting::errors {

    // Constante interne
    const E_INVALID_SIDE_INTERNAL: u64 = 1;
    const E_EVENT_CLOSED_INTERNAL: u64 = 2;
    const E_EVENT_NOT_STARTED_INTERNAL: u64 = 3;
    const E_EVENT_ENDED_INTERNAL: u64 = 4;
    const E_ALREADY_SETTLED_INTERNAL: u64 = 5;
    const E_UNAUTHORIZED_INTERNAL: u64 = 6;
    const E_NOTHING_TO_CLAIM_INTERNAL: u64 = 7;
    const E_ALREADY_CLAIMED_INTERNAL: u64 = 8;
    const E_NO_RESULT_INTERNAL: u64 = 9;
    const E_EVENT_STARTED_INTERNAL: u64 = 10;

    // Funcții publice care expun valorile
    public fun E_INVALID_SIDE(): u64 { E_INVALID_SIDE_INTERNAL }
    public fun E_EVENT_CLOSED(): u64 { E_EVENT_CLOSED_INTERNAL }
    public fun E_EVENT_NOT_STARTED(): u64 { E_EVENT_NOT_STARTED_INTERNAL }
    public fun E_EVENT_ENDED(): u64 { E_EVENT_ENDED_INTERNAL }
    public fun E_ALREADY_SETTLED(): u64 { E_ALREADY_SETTLED_INTERNAL }
    public fun E_UNAUTHORIZED(): u64 { E_UNAUTHORIZED_INTERNAL }
    public fun E_NOTHING_TO_CLAIM(): u64 { E_NOTHING_TO_CLAIM_INTERNAL }
    public fun E_ALREADY_CLAIMED(): u64 { E_ALREADY_CLAIMED_INTERNAL }
    public fun E_NO_RESULT(): u64 { E_NO_RESULT_INTERNAL }
    public fun E_EVENT_STARTED(): u64 { E_EVENT_STARTED_INTERNAL }
}
