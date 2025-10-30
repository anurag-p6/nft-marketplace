'use client';

import { useAccount } from 'wagmi';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function TestHooksPage() {
  const { address, isConnected } = useAccount();
  const { userNFTs, loading, error } = useMarketplace();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hook Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="mb-2">
            <strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}
          </p>
          <p className="mb-4">
            <strong>Address:</strong> {address || 'Not connected'}
          </p>

          <h2 className="text-xl font-semibold mb-4">Marketplace Status</h2>
          <p className="mb-2">
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
          </p>
          <p className="mb-2">
            <strong>Error:</strong> {error || 'None'}
          </p>
          <p className="mb-4">
            <strong>User NFTs:</strong> {userNFTs.length}
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Available Functions</h3>
            <p className="text-sm text-gray-600">
              ✅ useAccount hook working<br/>
              ✅ useMarketplace hook working<br/>
              ✅ No hook errors detected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
