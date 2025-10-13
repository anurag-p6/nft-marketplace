import { Address, parseEther, formatEther } from 'viem';
import { writeContract, waitForTransactionReceipt, readContract } from '@wagmi/core';
import { config } from '@/app/config/wagmi';
import { contracts } from '@/config/contracts';

export interface ListingData {
  listingId: bigint;
  seller: Address;
  nftContract: Address;
  tokenId: bigint;
  price: bigint;
  priceUSD: number;
  active: boolean;
}

/**
 * Fetches current ETH price in USD from CoinGecko API
 */
export async function getETHPriceInUSD(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    // Fallback price if API fails
    return 2000;
  }
}

/**
 * Converts USD to ETH
 */
export function usdToEth(usdAmount: number, ethPriceUSD: number): bigint {
  const ethAmount = usdAmount / ethPriceUSD;
  return parseEther(ethAmount.toString());
}

/**
 * Converts ETH to USD
 */
export function ethToUsd(ethAmount: bigint, ethPriceUSD: number): number {
  const ethValue = parseFloat(formatEther(ethAmount));
  return ethValue * ethPriceUSD;
}

/**
 * Lists an NFT on the marketplace
 */
export async function listNFT(params: {
  nftContract: Address;
  tokenId: bigint;
  priceUSD: number;
}): Promise<{ hash: Address; listingId?: bigint }> {
  const { nftContract, tokenId, priceUSD } = params;

  console.log('[Marketplace] Listing NFT with params:', params);

  // Get current ETH price
  const ethPriceUSD = await getETHPriceInUSD();
  const priceInWei = usdToEth(priceUSD, ethPriceUSD);

  console.log('[Marketplace] ETH Price (USD):', ethPriceUSD);
  console.log('[Marketplace] Price in Wei:', priceInWei.toString());

  // List the NFT on the marketplace
  const hash = await writeContract(config, {
    address: contracts.nftMarketplace.address,
    abi: contracts.nftMarketplace.abi,
    functionName: 'listNFT',
    args: [nftContract, tokenId, priceInWei],
  });

  console.log('[Marketplace] List transaction hash:', hash);

  // Wait for transaction confirmation
  const receipt = await waitForTransactionReceipt(config, { hash });

  console.log('[Marketplace] List transaction confirmed');

  // Parse the Listed event to get listing ID
  let listingId: bigint | undefined;
  if (receipt.logs && receipt.logs.length > 0) {
    // The Listed event is emitted with the listingId as the first indexed parameter
    // We need to find the log that matches the Listed event
    for (const log of receipt.logs) {
      if (log.topics[0]) {
        // Try to extract listingId from topics (first indexed parameter after event signature)
        if (log.topics.length > 1) {
          listingId = BigInt(log.topics[1]);
          break;
        }
      }
    }
  }

  return { hash, listingId };
}

/**
 * Gets listing data by listing ID
 */
export async function getListingById(listingId: bigint): Promise<ListingData | null> {
  try {
    const listing = await readContract(config, {
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'getListing',
      args: [listingId],
    });

    if (!listing || !Array.isArray(listing) || listing.length < 5) {
      return null;
    }

    const [seller, nftContract, tokenId, price, active] = listing as [Address, Address, bigint, bigint, boolean];

    if (!active) {
      return null;
    }

    // Get current ETH price for USD conversion
    const ethPriceUSD = await getETHPriceInUSD();
    const priceUSD = ethToUsd(price, ethPriceUSD);

    return {
      listingId,
      seller,
      nftContract,
      tokenId,
      price,
      priceUSD,
      active,
    };
  } catch (error) {
    console.error(`[Marketplace] Error getting listing ${listingId}:`, error);
    return null;
  }
}

/**
 * Gets listing data for a specific NFT token
 */
export async function getTokenListing(nftContract: Address, tokenId: bigint): Promise<ListingData | null> {
  try {
    // Get the listing ID for this token
    const listingId = await readContract(config, {
      address: contracts.nftMarketplace.address,
      abi: contracts.nftMarketplace.abi,
      functionName: 'tokenListings',
      args: [nftContract, tokenId],
    }) as bigint;

    if (!listingId || listingId === BigInt(0)) {
      return null;
    }

    return await getListingById(listingId);
  } catch (error) {
    console.error('[Marketplace] Error getting token listing:', error);
    return null;
  }
}

/**
 * Buys an NFT from the marketplace
 */
export async function buyNFT(listingId: bigint, price: bigint): Promise<{ hash: Address }> {
  console.log('[Marketplace] Buying NFT, listing ID:', listingId.toString());
  console.log('[Marketplace] Price:', price.toString());

  const hash = await writeContract(config, {
    address: contracts.nftMarketplace.address,
    abi: contracts.nftMarketplace.abi,
    functionName: 'buyNFT',
    args: [listingId],
    value: price,
  });

  console.log('[Marketplace] Buy transaction hash:', hash);

  // Wait for confirmation
  await waitForTransactionReceipt(config, { hash });

  console.log('[Marketplace] Buy transaction confirmed');

  return { hash };
}

/**
 * Cancels a listing
 */
export async function cancelListing(listingId: bigint): Promise<{ hash: Address }> {
  console.log('[Marketplace] Cancelling listing:', listingId.toString());

  const hash = await writeContract(config, {
    address: contracts.nftMarketplace.address,
    abi: contracts.nftMarketplace.abi,
    functionName: 'cancelListing',
    args: [listingId],
  });

  console.log('[Marketplace] Cancel transaction hash:', hash);

  await waitForTransactionReceipt(config, { hash });

  console.log('[Marketplace] Cancel transaction confirmed');

  return { hash };
}

/**
 * Updates listing price
 */
export async function updateListingPrice(listingId: bigint, newPriceUSD: number): Promise<{ hash: Address }> {
  console.log('[Marketplace] Updating listing price:', { listingId: listingId.toString(), newPriceUSD });

  // Convert USD to ETH
  const ethPriceUSD = await getETHPriceInUSD();
  const newPriceInWei = usdToEth(newPriceUSD, ethPriceUSD);

  const hash = await writeContract(config, {
    address: contracts.nftMarketplace.address,
    abi: contracts.nftMarketplace.abi,
    functionName: 'updateListingPrice',
    args: [listingId, newPriceInWei],
  });

  console.log('[Marketplace] Update price transaction hash:', hash);

  await waitForTransactionReceipt(config, { hash });

  console.log('[Marketplace] Update price transaction confirmed');

  return { hash };
}
