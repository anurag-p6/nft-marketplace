import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, sepolia],
  ssr: true,
});
