# NFT Marketplace

List, buy, and auction NFTs. Contracts in Foundry. App in Next.js.

## Contracts

- `src/NFTMarketplace.sol` — mint, list, buy
- `src/NFTAuction.sol` — timed auctions
- `src/NFTStorage.sol` — listing + metadata storage

## App

- `/` home grid
- `/create` list with Pinata metadata
- `/nft/[tokenId]` detail
- `/profile` listings you own

## Run

```bash
cd frontend && npm i && npm run dev