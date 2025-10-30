# NFT Marketplace Frontend Integration

This document explains how the frontend has been connected to the smart contracts for the NFT marketplace.

## Smart Contracts Integration

The frontend now includes full integration with three main smart contracts:

### 1. NFTStorage Contract
- **Purpose**: Manages NFT minting and metadata
- **Functions**: `mint()`, `getTotalMinted()`, `tokenURI()`, `ownerOf()`, `balanceOf()`
- **Location**: `src/NFTStorage.sol`

### 2. NFTMarketplace Contract  
- **Purpose**: Handles NFT listings, purchases, and offers
- **Functions**: `listNFT()`, `buyNFT()`, `makeOffer()`, `acceptOffer()`, `cancelListing()`, `cancelOffer()`
- **Location**: `src/NFTMarketplace.sol`

### 3. NFTAuction Contract
- **Purpose**: Manages NFT auctions and bidding
- **Functions**: `createAuction()`, `placeBid()`, `settleAuction()`, `cancelAuction()`, `withdrawBid()`
- **Location**: `src/NFTAuction.sol`

## Frontend Architecture

### Contract Hooks (`hooks/useContracts.ts`)
- `useNFTStorage()`: Hook for NFT minting and metadata operations
- `useNFTMarketplace()`: Hook for marketplace operations (list, buy, offer)
- `useNFTAuction()`: Hook for auction operations (create, bid, settle)

### Marketplace Service (`services/marketplaceService.ts`)
- High-level service class that provides business logic
- Handles metadata fetching from IPFS
- Provides utility functions for ETH formatting
- Manages complex operations like user NFT retrieval

### Marketplace Context (`contexts/MarketplaceContext.tsx`)
- React context for global marketplace state management
- Provides centralized access to marketplace functions
- Handles loading states and error management
- Auto-refreshes data when wallet connection changes

## Key Components

### MarketplaceNFTCard (`components/MarketplaceNFTCard.tsx`)
- Displays NFT information with marketplace actions
- Shows listing status, auction status, and pricing
- Includes modals for making offers and placing bids
- Handles buy now, make offer, and bid actions

### Marketplace Page (`app/marketplace/page.tsx`)
- Main marketplace interface
- Displays user NFTs, listings, and auctions
- Includes search and filtering functionality
- Shows marketplace statistics

### NFT Management Page (`app/nft/[tokenId]/manage/page.tsx`)
- Individual NFT management interface
- Allows listing NFTs for sale
- Enables creating auctions
- Provides cancel listing/auction functionality

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# WalletConnect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here

# Contract Addresses (update after deployment)
NEXT_PUBLIC_NFT_STORAGE_ADDRESS=0x...
NEXT_PUBLIC_NFT_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_NFT_AUCTION_ADDRESS=0x...
```

## Deployment Steps

1. **Deploy Smart Contracts**:
   ```bash
   cd /Users/apple/Desktop/w/s/nft-marketplace
   forge build
   forge script script/NFTStorage.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
   ```

2. **Update Contract Addresses**:
   - Copy deployed contract addresses to `.env.local`
   - Update `config/contracts.ts` if needed

3. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Features Implemented

### ✅ NFT Management
- View owned NFTs
- Mint new NFTs (requires owner permissions)
- Display NFT metadata and images

### ✅ Marketplace Operations
- List NFTs for sale
- Buy NFTs directly
- Make offers on listed NFTs
- Accept or cancel offers
- Cancel listings

### ✅ Auction System
- Create NFT auctions
- Place bids on auctions
- Settle completed auctions
- Cancel auctions (if no bids)
- Withdraw losing bids

### ✅ User Interface
- Responsive design
- Loading states
- Error handling
- Transaction status tracking
- Real-time updates

## Usage Examples

### Listing an NFT
```typescript
const { listNFT } = useMarketplace();
await listNFT(nftContract, tokenId, "0.1"); // List for 0.1 ETH
```

### Buying an NFT
```typescript
const { buyNFT } = useMarketplace();
await buyNFT(listingId, "0.1"); // Buy for 0.1 ETH
```

### Creating an Auction
```typescript
const { createAuction } = useMarketplace();
const duration = BigInt(7 * 24 * 60 * 60); // 7 days
await createAuction(nftContract, tokenId, "0.1", duration);
```

## Security Considerations

- All contract interactions require wallet connection
- User ownership is verified before allowing actions
- Transaction confirmations are required for state changes
- Error handling prevents failed transactions from breaking the UI

## Next Steps

1. Deploy contracts to a testnet (Sepolia, Goerli)
2. Update contract addresses in environment variables
3. Test all marketplace functionality
4. Add more advanced features like:
   - Batch operations
   - Advanced filtering
   - Price history tracking
   - Royalty management
   - Collection management

## Troubleshooting

### Common Issues

1. **Contract addresses not set**: Ensure all environment variables are configured
2. **Transaction failures**: Check wallet connection and sufficient ETH balance
3. **ABI errors**: Ensure contract ABIs are up to date after contract changes
4. **Network issues**: Verify correct RPC URL and network configuration

### Debug Mode

Enable debug logging by adding to your environment:
```env
NEXT_PUBLIC_DEBUG=true
```

This will log all contract interactions and help identify issues.
