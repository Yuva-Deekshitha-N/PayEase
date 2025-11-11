# PayEase Smart Contracts

## Current Status: ❌ NOT LINKED

Your smart contracts exist but are **NOT connected** to your frontend yet.

## What You Have
- ✅ `MainSmartContract.algo.ts` - Main contract for user registration
- ✅ `UserAccount.algo.ts` - Individual user account management
- ✅ Frontend integration layer (`lib/algorand/contracts.ts`)
- ❌ **Contracts are using MOCK functions only**

## To Link Your Contracts

### 1. Install Dependencies
```bash
npm install @algorandfoundation/algorand-typescript
```

### 2. Compile Contracts
```bash
# Compile .algo.ts files to TEAL bytecode
npx algots compile contracts/src/MainSmartContract.algo.ts
npx algots compile contracts/src/UserAccount.algo.ts
```

### 3. Deploy to Testnet
```bash
# Deploy and get contract IDs
npm run deploy:contracts
```

### 4. Update Contract IDs
Replace these in `lib/algorand/contracts.ts`:
```typescript
export const MAIN_CONTRACT_ID = 0; // ← Replace with deployed ID
export const USER_ACCOUNT_CONTRACT_ID = 0; // ← Replace with deployed ID
```

## Contract Functions

### MainSmartContract
- `createApplication()` - Initialize main contract
- `register(payTxn, userAddress)` - Register user with payment

### UserAccountContract  
- `createApplication(ownerAddress)` - Initialize user account
- `verify(providerName, proofHash, account)` - Verify user identity

## Current Integration Status
- **Connection Check**: ✅ Working (shows Algorand client connected)
- **Contract Calls**: ❌ Using mock functions
- **Real Transactions**: ❌ Not implemented yet

Run `npm run deploy:contracts` to link your contracts!