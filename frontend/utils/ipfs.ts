// Client-side IPFS utilities

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export function getIPFSUrl(cid: string): string {
  return `https://ipfs.io/ipfs/${cid}`;
}

export function getInfuraIPFSUrl(cid: string): string {
  return `https://nft-marketplace.infura-ipfs.io/ipfs/${cid}`;
}