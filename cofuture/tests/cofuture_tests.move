module 0x0::cofuture_test {
    // Import only public entry points and getters
    use 0x0::cofuture::{
        deposit, send_capsule, claim_capsule,
        // Add any public getter functions here, e.g.:
        // get_claimed_count, get_claimed_bitmap_len,
    };
    use sui::coin::{mint, TreasuryCap};
    use sui::tx_context::TxContext;
    use sui::clock::Clock;
    use std::vector;

    /// Test addresses to simulate different users
    const USER1: address = @0x101;
    const USER2: address = @0x102;

    #[test_only]
    public fun test_capsule_flow(ctx: &mut TxContext) {
        // Step 1: Mint coins for testing
        let cap = sui::test_sui_treasury_cap();
        let mut coin = mint(&mut cap, 10_000_000_000, ctx);

        // Step 2: (If available) Call your public init/create_vault to create a new vault
        // let mut vault = create_vault(ctx); // Uncomment if available

        // Step 3: Deposit funds into the vault
        // deposit(&mut vault, &mut coin, 5_000_000_000);

        // Step 4: Prepare the audience (users allowed to claim) and the encrypted content
        let mut coin2 = mint(&mut cap, 3_000_000_000, ctx);
        let content = b"hello future";
        let mut audience = vector::empty<address>();
        vector::push_back(&mut audience, USER1);
        vector::push_back(&mut audience, USER2);

        // Step 5: Create a fake clock object for timing
        let fake_time = 1_000_000u64;
        let unlock_duration = 1_000u64;
        let clock = Clock { id: sui::object::new(ctx), timestamp_ms: fake_time };
        // Note: If Clock cannot be constructed directly, use any available helper

        // Step 6: Call send_capsule to create a new capsule
        // send_capsule(&mut vault, &mut coin2, content, unlock_duration, audience, 1_000_000_000, &clock, ctx);

        // Step 7: Claim the capsule with the correct user and unlocked time
        // set_test_sender(ctx, USER1); // Set sender if your test utils allow it
        // let msg = claim_capsule(&mut vault, &mut capsule, &clock, ctx);
        // assert!(msg == b"hello future", 101);

        // Step 8: Use getter functions to verify claim status
        // let claimed_count = get_claimed_count(&capsule);
        // assert!(claimed_count == 1, 102);
    }

    // Helper to change sender in test (if available in your framework)
    // public fun set_test_sender(ctx: &mut TxContext, user: address) {
    //     sui::tx_context::set_test_sender(ctx, user);
    // }
}
