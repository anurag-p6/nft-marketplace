import { Address } from 'viem';
import { readContract } from '@wagmi/core';
import { config } from '@/app/config/wagmi';
import { contracts } from '@/config/contracts';
import { NFTMetadata } from './ipfs';
import { getTokenListing, ListingData } from './marketplace';
import { sepolia } from 'wagmi/chains';

export interface NFTData {
  tokenId: string;
  owner: Address;
  tokenURI: string;
  metadata?: NFTMetadata;
  listing?: ListingData | null;
}

/**
 * Fetches NFT metadata from IPFS
 */
async function fetchMetadataFromIPFS(tokenURI: string): Promise<NFTMetadata | null> {
  try {
    // Handle different IPFS gateway formats
    let url = tokenURI;
    if (tokenURI.startsWith('ipfs://')) {
      url = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch metadata from ${url}`);
      return null;
    }

    const metadata: NFTMetadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
}

/**
 * Gets the balance of NFTs owned by an address
 */
export async function getBalance(owner: Address): Promise<bigint> {
  try {
    const balance = await readContract(config, {
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'balanceOf',
      args: [owner],
      chainId: sepolia.id,
    });

    return balance as bigint;
  } catch (error) {
    console.error('Error getting balance:', error);
    return BigInt(0);
  }
}

/**
 * Gets the total number of NFTs minted
 */
export async function getTotalMinted(): Promise<bigint> {
  try {
    const total = await readContract(config, {
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'getTotalMinted',
      args: [],
      chainId: sepolia.id,
    });

    return total as bigint;
  } catch (error) {
    console.error('Error getting total minted:', error);
    return BigInt(0);
  }
}

/**
 * Gets the owner of a specific token ID
 */
export async function getTokenOwner(tokenId: bigint): Promise<Address | null> {
  try {
    const owner = await readContract(config, {
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'ownerOf',
      args: [tokenId],
      chainId: sepolia.id,
    });

    return owner as Address;
  } catch (error) {
    // Token doesn't exist or error occurred
    return null;
  }
}

/**
 * Gets the token URI for a specific token ID
 */
export async function getTokenURI(tokenId: bigint): Promise<string | null> {
  try {
    const uri = await readContract(config, {
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'tokenURI',
      args: [tokenId],
      chainId: sepolia.id,
    });

    return uri as string;
  } catch (error) {
    console.error(`Error getting token URI for token ${tokenId}:`, error);
    return null;
  }
}

/**
 * Fetches all NFTs owned by a specific address
 */
export async function getUserNFTs(owner: Address): Promise<NFTData[]> {
  try {
    console.log('[fetchNFTs] Fetching NFTs for owner:', owner);

    // Get total number of minted NFTs
    const totalMinted = await getTotalMinted();
    console.log('[fetchNFTs] Total minted:', totalMinted.toString());

    const nfts: NFTData[] = [];

    // Iterate through all token IDs and check ownership
    for (let i = BigInt(1); i <= totalMinted; i++) {
      try {
        const tokenOwner = await getTokenOwner(i);

        if (tokenOwner && tokenOwner.toLowerCase() === owner.toLowerCase()) {
          const tokenURI = await getTokenURI(i);

          const nftData: NFTData = {
            tokenId: i.toString(),
            owner: tokenOwner,
            tokenURI: tokenURI || '',
          };

          // Fetch metadata if token URI exists
          if (tokenURI) {
            const metadata = await fetchMetadataFromIPFS(tokenURI);
            if (metadata) {
              nftData.metadata = metadata;
            }
          }

          // Fetch listing data
          try {
            const listing = await getTokenListing(contracts.nftStorage.address, i);
            nftData.listing = listing;
          } catch (error) {
            console.log(`[fetchNFTs] No listing for token ${i}`);
            nftData.listing = null;
          }

          nfts.push(nftData);
        }
      } catch (error) {
        // Token might not exist, continue
        console.log(`[fetchNFTs] Token ${i} doesn't exist or error:`, error);
      }
    }

    console.log('[fetchNFTs] Found NFTs:', nfts.length);
    return nfts;
  } catch (error) {
    console.error('[fetchNFTs] Error fetching user NFTs:', error);
    return [];
  }
}

/**
 * Fetches all minted NFTs (for home page)
 */
export async function getAllNFTs(): Promise<NFTData[]> {
  try {
    console.log('[fetchNFTs] Fetching all NFTs');

    // Get total number of minted NFTs
    const totalMinted = await getTotalMinted();
    console.log('[fetchNFTs] Total minted:', totalMinted.toString());

    const nfts: NFTData[] = [];

    // Iterate through all token IDs
    for (let i = BigInt(1); i <= totalMinted; i++) {
      try {
        const tokenOwner = await getTokenOwner(i);

        if (tokenOwner) {
          const tokenURI = await getTokenURI(i);

          const nftData: NFTData = {
            tokenId: i.toString(),
            owner: tokenOwner,
            tokenURI: tokenURI || '',
          };

          // Fetch metadata if token URI exists
          if (tokenURI) {
            const metadata = await fetchMetadataFromIPFS(tokenURI);
            if (metadata) {
              nftData.metadata = metadata;
            }
          }

          // Fetch listing data
          try {
            const listing = await getTokenListing(contracts.nftStorage.address, i);
            nftData.listing = listing;
          } catch (error) {
            console.log(`[fetchNFTs] No listing for token ${i}`);
            nftData.listing = null;
          }

          nfts.push(nftData);
        }
      } catch (error) {
        // Token might not exist, continue
        console.log(`[fetchNFTs] Token ${i} doesn't exist or error:`, error);
      }
    }

    console.log('[fetchNFTs] Found total NFTs:', nfts.length);
    return nfts;
  } catch (error) {
    console.error('[fetchNFTs] Error fetching all NFTs:', error);
    return [];
  }
}
