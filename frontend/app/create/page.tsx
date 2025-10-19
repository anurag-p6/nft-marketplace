'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { NFTMetadata, getIPFSUrl } from '@/utils/ipfs';
import { mintNFT, approveNFT } from '@/utils/nft';
import { listNFT } from '@/utils/marketplace';
import { contracts } from '@/config/contracts';
import Loader from '@/components/Loader'; 

export default function CreateNFTPage() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Art',
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [attributes, setAttributes] = useState<Array<{ trait_type: string; value: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [imageCID, setImageCID] = useState<string>('');
  const [metadataCID, setMetadataCID] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [listingId, setListingId] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addAttribute = () => {
    setAttributes([...attributes, { trait_type: '', value: '' }]);
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const uploadImage = async () => {
    if (!file) throw new Error('No file selected');

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    const response = await fetch('/api/upload', { method: 'POST', body: formDataToSend });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to upload image');

    return data.cid;
  };

  const uploadMetadata = async (imageCID: string) => {
    const metadata: NFTMetadata = {
      name: formData.name,
      description: formData.description,
      image: getIPFSUrl(imageCID),
      attributes: [
        ...attributes.filter((attr) => attr.trait_type && attr.value),
        { trait_type: 'Category', value: formData.category }, // ✅ Category added to metadata
      ],
    };

    const formDataToSend = new FormData();
    formDataToSend.append('metadata', JSON.stringify(metadata));

    const response = await fetch('/api/upload', { method: 'POST', body: formDataToSend });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    return data.cid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return alert('Please connect your wallet first');
    if (!file || !formData.name || !formData.description) return alert('Fill all required fields');
    if (!formData.price || parseFloat(formData.price) <= 0) return alert('Invalid price');

    try {
      setLoading(true);
      setLoadingMessage('Uploading image to IPFS...');
      const uploadedImageCID = await uploadImage();
      setImageCID(uploadedImageCID);

      setLoadingMessage('Uploading metadata to IPFS...');
      const uploadedMetadataCID = await uploadMetadata(uploadedImageCID);
      setMetadataCID(uploadedMetadataCID);

      setLoadingMessage('Minting NFT on blockchain...');
      const tokenURI = getIPFSUrl(uploadedMetadataCID);
      const mintResult = await mintNFT({ to: address, tokenURI });

      setTxHash(mintResult.hash);
      if (mintResult.tokenId) {
        setTokenId(mintResult.tokenId.toString());

        setLoadingMessage('Approving marketplace contract...');
        await approveNFT(mintResult.tokenId);

        setLoadingMessage('Listing NFT on marketplace...');
        const listResult = await listNFT({
          nftContract: contracts.nftStorage.address,
          tokenId: mintResult.tokenId,
          priceUSD: parseFloat(formData.price),
        });

        if (listResult.listingId) setListingId(listResult.listingId.toString());

        alert(
          `✅ NFT created & listed!\nToken ID: ${mintResult.tokenId}\nCategory: ${formData.category}\nPrice: $${formData.price}`
        );
      }
    } catch (err) {
      console.error('Error creating NFT:', err);
      alert(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Create NFT</h1>
          <p className="text-gray-600">Please connect your wallet to create an NFT</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create NFT</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload File *</label>
              <input
                type="file"
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg max-h-64 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="NFT Name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your NFT"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category - Modern Card Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Category *</label>
              <div className="grid grid-cols-3 gap-3">
                {['Art', 'Gaming', 'Music', 'Sports', 'VirtualWorld', 'Other'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`border rounded-md px-4 py-2 text-sm font-medium transition-all ${
                      formData.category === cat
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 sm:text-sm">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  required
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Price in USD (auto-converted to ETH during listing)
              </p>
            </div>

            {/* Attributes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Attributes (Optional)</label>
                <button
                  type="button"
                  onClick={addAttribute}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Attribute
                </button>
              </div>
              <div className="space-y-3">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={attr.trait_type}
                      onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                      placeholder="Trait (e.g., Color)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                      placeholder="Value (e.g., Blue)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Minted / Listing Info */}
            {tokenId && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">NFT Created Successfully!</p>
                <div className="space-y-2">
                  <p className="text-xs"><strong>Token ID:</strong> {tokenId}</p>
                  <p className="text-xs"><strong>Category:</strong> {formData.category}</p>
                  <p className="text-xs"><strong>Price:</strong> ${formData.price} USD</p>
                  {listingId && <p className="text-xs"><strong>Listing ID:</strong> {listingId}</p>}
                  {txHash && (
                    <p className="text-xs break-all">
                      <strong>Transaction Hash:</strong> {txHash}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? loadingMessage || 'Processing...' : 'Create & List NFT'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
