import { Address, Hash } from 'viem';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/config/wagmi';
import { contracts } from '@/config/contracts';

export interface MintNFTParams {
  to: Address;
  tokenURI: string;
}

export interface MintNFTResult {
  hash: Hash;
  tokenId?: bigint;
}

/**
 * Mints an NFT to the specified address with the given metadata URI
 * @param params - Minting parameters including recipient address and token URI
 * @returns Transaction hash and token ID
 */
export async function mintNFT(params: MintNFTParams): Promise<MintNFTResult> {
  const { to, tokenURI } = params;

  console.log('[NFT Utils] Minting NFT with params:', { to, tokenURI });

  // Validate contract address is configured
  if (!contracts.nftStorage.address) {
    throw new Error('NFT Storage contract address is not configured. Please add NEXT_PUBLIC_NFT_STORAGE_ADDRESS to your .env file');
  }

  try {
    // Call the mint function on the NFTStorage contract
    const hash = await writeContract(config, {
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'mint',
      args: [to, tokenURI],
    });

    console.log('[NFT Utils] Transaction submitted:', hash);

    // Wait for transaction confirmation
    const receipt = await waitForTransactionReceipt(config, {
      hash,
    });

    console.log('[NFT Utils] Transaction confirmed:', receipt);

    // Parse the NFTMinted event to get the token ID
    let tokenId: bigint | undefined;
    if (receipt.logs && receipt.logs.length > 0) {
      // The mint function returns the token ID, and we can also find it in the Transfer event
      // Transfer event is emitted with topics: [event signature, from (0x0), to, tokenId]
      const transferLog = receipt.logs.find(log =>
        log.topics.length === 4 &&
        log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // Transfer event signature
      );

      if (transferLog && transferLog.topics[3]) {
        tokenId = BigInt(transferLog.topics[3]);
        console.log('[NFT Utils] Minted Token ID:', tokenId.toString());
      }
    }

    return {
      hash,
      tokenId,
    };
  } catch (error) {
    console.error('[NFT Utils] Minting error:', error);

    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        throw new Error('Transaction was rejected by user');
      }
      if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds to pay for gas');
      }
      throw error;
    }

    throw new Error('Failed to mint NFT. Please try again.');
  }
}

/**
 * Approves the marketplace contract to transfer the NFT
 * @param tokenId - The token ID to approve
 * @returns Transaction hash
 */
export async function approveNFT(tokenId: bigint): Promise<Hash> {
  console.log('[NFT Utils] Approving NFT for marketplace:', {
    tokenId: tokenId.toString(),
    marketplace: contracts.nftMarketplace.address,
  });

  if (!contracts.nftMarketplace.address) {
    throw new Error('NFT Marketplace contract address is not configured');
  }

  try {
    const hash = await writeContract(config, {
      address: contracts.nftStorage.address,
      abi: contracts.nftStorage.abi,
      functionName: 'approve',
      args: [contracts.nftMarketplace.address, tokenId],
    });

    console.log('[NFT Utils] Approval transaction submitted:', hash);

    // Wait for transaction confirmation
    await waitForTransactionReceipt(config, { hash });

    console.log('[NFT Utils] Approval confirmed');

    return hash;
  } catch (error) {
    console.error('[NFT Utils] Approval error:', error);

    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        throw new Error('Approval was rejected by user');
      }
      throw error;
    }

    throw new Error('Failed to approve NFT. Please try again.');
  }
}

/**
 * Gets the total number of NFTs minted
 */
export async function getTotalMinted(): Promise<bigint> {
  if (!contracts.nftStorage.address) {
    throw new Error('NFT Storage contract address is not configured');
  }

  // This would use readContract from wagmi
  // For now, returning a placeholder
  return BigInt(0);
}