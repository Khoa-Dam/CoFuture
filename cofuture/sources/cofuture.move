/*
/// Module: cofuture
module cofuture::cofuture;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module cofuture::cofuture {
     use sui::object::{Self, ID, UID};
    use sui::balance::{Self, Balance, split, join, value, zero};
    use sui::coin::{Self, Coin, TreasuryCap, take, join as coin_join};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext, sender};
    use sui::clock::{Self, Clock, timestamp_ms};
    use sui::event;
    use sui::sui::SUI;
    use sui::address;
    use std::vector;
    use std::option::{Self as option, Option};



     // --- Error Codes ---
    const E_TIME_NOT_REACHED: u64 = 0;
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_ALREADY_CLAIMED: u64 = 2;
    const E_NO_REWARD_LEFT: u64 = 3;

    // --- Structs ---

    /// Vault chứa phần thưởng, để chia cho nhiều người khi claim public
    public struct Vault has key {
        id: UID,
        balance: Balance<0x2::sui::SUI>,
    }

    /// Time Capsule: Lưu encrypted_content, time lock, audience, phần thưởng
    public struct Capsule has key, store {
        id: UID,
        creator: address,
        encrypted_content: vector<u8>,
        unlock_timestamp_ms: u64,
        audience: vector<address>,    // Các user được claim
        total_reward: u64,            // Tổng phần thưởng gửi kèm (SUI)
        reward_per_user: u64,         // Mỗi user nhận được bao nhiêu
        max_claim: u64,               // Số người claim tối đa (chia đều)
        claimed_count: u64,           // Đã có bao nhiêu người claim
        claimed_bitmap: vector<address>, // Lưu các địa chỉ đã claim
    }

    // --- Events ---
    public struct CapsuleCreated has copy, drop {
        capsule_id: ID,
        creator: address,
        unlock_timestamp_ms: u64,
        audience_size: u64,
        total_reward: u64,
    }

   public struct CapsuleClaimed has copy, drop {
        capsule_id: ID,
        claimer: address,
        timestamp_ms: u64,
        reward_amount: u64,
    }

    // --- Entry Functions ---

    /// Khởi tạo vault cho phần thưởng
    public entry fun init(ctx: &mut TxContext) {
    let vault = Vault {
        id: object::new(ctx),
        balance: balance::zero<0x2::sui::SUI>(),
    };
    transfer::share_object(vault);
}

    /// Nạp thêm tiền vào vault
    public entry fun deposit(
        vault: &mut Vault,
        coin: &mut Coin<0x2::sui::SUI>,
        amount: u64,
    ) {
        let split_balance = split(coin::balance_mut(coin), amount);
        join(&mut vault.balance, split_balance);
    }

    /// Gửi capsule: encrypted_content, unlock_time, audience, reward (chia đều)
public entry fun send_capsule(
    vault: &mut Vault,
    coin: &mut Coin<SUI>,
    encrypted_content: vector<u8>,
    unlock_duration_ms: u64,
    audience: vector<address>,
    reward_per_user: u64,
    clock: &Clock,
    ctx: &mut TxContext,      // <-- ĐÚNG, LUÔN LÀ &mut TxContext
) {
    let creator = sender(ctx);
    let now = timestamp_ms(clock);
    let unlock_timestamp_ms = now + unlock_duration_ms;

    let audience_size = vector::length(&audience);
    let total_reward = reward_per_user * audience_size;
    // Nạp reward vào vault
    let split_balance = split(coin::balance_mut(coin), total_reward);
    join(&mut vault.balance, split_balance);

    let capsule = Capsule {
        id: object::new(ctx),   // đúng: truyền ctx (by-mut)
        creator,
        encrypted_content,
        unlock_timestamp_ms,
        audience,
        total_reward,
        reward_per_user,
        max_claim: audience_size,
        claimed_count: 0,
        claimed_bitmap: vector::empty<address>(),
    };

    event::emit(CapsuleCreated {
        capsule_id: object::uid_to_inner(&capsule.id),
        creator,
        unlock_timestamp_ms,
        audience_size: audience_size,
        total_reward,
    });

    transfer::share_object(capsule);
}



    /// Claim (mở capsule + nhận thưởng). Chỉ audience/creator, chỉ 1 lần/người
    public entry fun claim_capsule(
        vault: &mut Vault,
        capsule: &mut Capsule,
        clock: &Clock,
        ctx: &mut TxContext,
    ): vector<u8> {
        let user = sender(ctx);
        let now = timestamp_ms(clock);
        // Đúng thời gian unlock
        assert!(now >= capsule.unlock_timestamp_ms, E_TIME_NOT_REACHED);

        // Chỉ creator hoặc trong audience mới claim được
        let mut authorized = user == capsule.creator;
        if (!authorized) {
            authorized = vector::contains(&capsule.audience, &user);
        };
        assert!(authorized, E_NOT_AUTHORIZED);

        // Check đã claim chưa (dựa vào bitmap)
        assert!(!vector::contains(&capsule.claimed_bitmap, &user), E_ALREADY_CLAIMED);

        // Còn phần thưởng không?
        assert!(capsule.claimed_count < capsule.max_claim, E_NO_REWARD_LEFT);

        // Trả thưởng
        let reward = take(&mut vault.balance, capsule.reward_per_user, ctx);
        transfer::public_transfer(reward, user);

        // Đánh dấu đã claim
        vector::push_back(&mut capsule.claimed_bitmap, user);
        capsule.claimed_count = capsule.claimed_count + 1;

        event::emit(CapsuleClaimed {
            capsule_id: object::uid_to_inner(&capsule.id),
            claimer: user,
            timestamp_ms: now,
            reward_amount: capsule.reward_per_user,
        });

        // Trả về encrypted_content (client giải mã ngoài chain)
        *&capsule.encrypted_content
    }

    // ---- View functions, helper ----
    #[view]
    public fun get_unlock_timestamp_ms(capsule: &Capsule): u64 {
        capsule.unlock_timestamp_ms
    }

    #[view]
    public fun get_creator(capsule: &Capsule): address {
        capsule.creator
    }

    #[view]
    public fun get_audience(capsule: &Capsule): vector<address> {
        *&capsule.audience
    }

    #[view]
    public fun get_claimed_bitmap(capsule: &Capsule): vector<address> {
        *&capsule.claimed_bitmap
    }

    #[view]
    public fun is_unlock_time_passed(capsule: &Capsule, clock: &Clock): bool {
        timestamp_ms(clock) >= capsule.unlock_timestamp_ms
    }
}