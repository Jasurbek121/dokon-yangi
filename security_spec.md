# Security Specification for Nirmal Mobile Dashboard

## Data Invariants
1. A Store, InventoryItem, Order, or Purchase must always have a `userId` that matches the authenticated user's UID.
2. Timestamps (`createdAt`, `updatedAt`) must be set by the server.
3. Amounts and quantities must be non-negative.

## The "Dirty Dozen" Payloads (Deny Cases)

These payloads must be rejected by Firestore security rules.

1. **Identity Theft** (Store)
```json
{ "userId": "attacker_uid", "name": "Fake Store", "sales": 0 }
```
*Wait: Must be rejected because `userId` doesn't match `request.auth.uid`.*

2. **Shadow Field** (User Profile)
```json
{ "uid": "user_123", "email": "user@example.com", "isAdmin": true, "role": "admin" }
```
*Must be rejected because `isAdmin` and `role` are not in the allowlist of affectedKeys().*

3. **Invalid ID Poisoning** (Store)
```json
// Targeted at: /stores/very-long-id-that-exceeds-128-chars...
```
*Must be rejected by `isValidId(storeId)`.*

4. **Negative Inventory** (Inventory)
```json
{ "userId": "user_123", "name": "Item", "quantity": -50 }
```
*Must be rejected by `isValidInventory` schema check.*

5. **Type Poisoning** (Order)
```json
{ "userId": "user_123", "customerName": "John", "amount": "1000", "status": "pending" }
```
*Must be rejected because `amount` is a string, not a number.*

6. **PII Breach** (User Profile)
*User A tries to `get` `/users/UserB`.*
*Must be rejected by `isOwner(userId)`.*

7. **Time Travel** (Store Creation)
```json
{ "userId": "user_123", "name": "Store", "sales": 0, "createdAt": "2000-01-01T00:00:00Z" }
```
*Must be rejected if we enforce `incoming().createdAt == request.time`.*

8. **Resource Exhaustion** (Large Payload)
```json
{ "userId": "user_123", "name": "A".repeat(1001), "sales": 0 }
```
*Must be rejected by `.size() <= 100` on `name`.*

9. **State Skipping** (Order)
```json
{ "userId": "user_123", "customerName": "John", "amount": 100, "status": "god_mode" }
```
*Must be rejected by the `status` enum check.*

10. **Mass Update / Ownership Change** (Store Update)
```json
{ "userId": "new_owner_uid", "name": "Stolen Store", "sales": 1000 }
```
*Must be rejected because `userId` is immutable in updates.*

11. **Malicious Content**
```json
{ "userId": "user_123", "name": "<script>alert(1)</script>", "sales": 0 }
```
*While we don't strictly block HTML via rules, we enforce length limits which mitigate large injections.*

12. **Unauthorized List Access**
*User A tries to list `/stores` without filtering by `userId == UserA`.*
*Rule must enforce `resource.data.userId == request.auth.uid` or reject the query.*

## Verification Strategy
- We will deploy rules that enforce `request.auth.uid == resource.data.userId` for all collections except `users` which uses the document ID.
- We will use `isValidId` for all path variables.
- We will use `affectedKeys().hasOnly()` for updates.
