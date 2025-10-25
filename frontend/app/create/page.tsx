'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { NFTMetadata, getIPFSUrl } from '@/utils/ipfs';
import { mintNFT, approveNFT } from '@/utils/nft';
import { listNFT } from '@/utils/marketplace';
import { contracts } from '@/config/contracts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image, 
  Music, 
  Video, 
  FileText, 
  Palette,
  Gamepad2,
  Headphones,
  Trophy,
  Globe,
  Zap,
  CheckCircle,
  Sparkles,
  Plus,
  X,
  ArrowRight
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 }
};

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
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    { id: 'Art', name: 'Art', icon: <Palette className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'Gaming', name: 'Gaming', icon: <Gamepad2 className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'Music', name: 'Music', icon: <Headphones className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
    { id: 'Sports', name: 'Sports', icon: <Trophy className="w-5 h-5" />, color: 'from-orange-500 to-red-500' },
    { id: 'VirtualWorld', name: 'Virtual World', icon: <Globe className="w-5 h-5" />, color: 'from-indigo-500 to-purple-500' },
    { id: 'Other', name: 'Other', icon: <Sparkles className="w-5 h-5" />, color: 'from-gray-500 to-gray-600' },
  ];

  const steps = [
    { number: 1, title: 'Upload Media', description: 'Add your NFT content' },
    { number: 2, title: 'Details', description: 'Describe your NFT' },
    { number: 3, title: 'Attributes', description: 'Add traits & properties' },
    { number: 4, title: 'Pricing', description: 'Set your price' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setCurrentStep(2);
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
        { trait_type: 'Category', value: formData.category },
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

        setCurrentStep(5); // Success step
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Create NFT</h1>
          <p className="text-gray-600 dark:text-gray-400">Please connect your wallet to create an NFT</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Create Your Digital Masterpiece
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create NFT
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Turn your creativity into a unique digital asset on the blockchain
          </p>
        </motion.header>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.number 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            {steps.map(step => (
              <div key={step.number} className="text-center">
                <div className="font-medium">{step.title}</div>
                <div>{step.description}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {currentStep === 5 ? (
              // Success Step
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  NFT Created Successfully!
                </h2>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6 max-w-md mx-auto">
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="text-green-800 dark:text-green-300 font-medium">Token ID:</span>
                      <span className="text-green-900 dark:text-green-100">{tokenId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-800 dark:text-green-300 font-medium">Category:</span>
                      <span className="text-green-900 dark:text-green-100">{formData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-800 dark:text-green-300 font-medium">Price:</span>
                      <span className="text-green-900 dark:text-green-100">${formData.price} USD</span>
                    </div>
                    {listingId && (
                      <div className="flex justify-between">
                        <span className="text-green-800 dark:text-green-300 font-medium">Listing ID:</span>
                        <span className="text-green-900 dark:text-green-100">{listingId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {previewUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <img
                      src={previewUrl}
                      alt="NFT Preview"
                      className="max-w-sm mx-auto rounded-xl shadow-lg"
                    />
                  </motion.div>
                )}

                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentStep(1);
                      setFormData({ name: '', description: '', price: '', category: 'Art' });
                      setFile(null);
                      setPreviewUrl('');
                      setAttributes([]);
                      setTokenId('');
                      setTxHash('');
                      setListingId('');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Another
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/explore'}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
                  >
                    Explore Marketplace
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              // Form Steps
              <motion.form
                key={`step-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="p-8 space-y-8"
              >
                {/* Step 1: Upload Media */}
                {currentStep === 1 && (
                  <motion.div variants={fadeInUp}>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Upload Your Media
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-600 transition-colors duration-300">
                      <input
                        type="file"
                        accept="image/*,video/*,audio/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        required
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                        >
                          <Upload className="w-8 h-8 text-gray-500" />
                        </motion.div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Supports images, videos, and audio files
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Image className="w-4 h-4" />
                            Images
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Video className="w-4 h-4" />
                            Videos
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Music className="w-4 h-4" />
                            Audio
                          </div>
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Details */}
                {currentStep === 2 && (
                  <motion.div variants={staggerContainer} className="space-y-6">
                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Give your NFT a unique name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Describe your NFT and its story..."
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                      />
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Category *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categories.map((category) => (
                          <motion.button
                            key={category.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData({ ...formData, category: category.id })}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                              formData.category === category.id
                                ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg`
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                            }`}
                          >
                            {category.icon}
                            <span className="font-medium text-sm">{category.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    {previewUrl && (
                      <motion.div variants={fadeInUp} className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Preview
                        </label>
                        <div className="max-w-xs mx-auto">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="rounded-xl shadow-lg w-full"
                          />
                        </div>
                      </motion.div>
                    )}

                    <motion.div variants={fadeInUp} className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        disabled={!formData.name || !formData.description}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 3: Attributes */}
                {currentStep === 3 && (
                  <motion.div variants={staggerContainer} className="space-y-6">
                    <motion.div variants={fadeInUp}>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-lg font-semibold text-gray-900 dark:text-white">
                          Attributes (Optional)
                        </label>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={addAttribute}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Attribute
                        </motion.button>
                      </div>
                      
                      <div className="space-y-4">
                        {attributes.map((attr, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex gap-3 items-start"
                          >
                            <input
                              type="text"
                              value={attr.trait_type}
                              onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                              placeholder="Trait (e.g., Color, Rarity)"
                              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <input
                              type="text"
                              value={attr.value}
                              onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                              placeholder="Value (e.g., Blue, Legendary)"
                              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            />
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeAttribute(index)}
                              className="p-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>

                      {attributes.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-8 text-gray-500 dark:text-gray-400"
                        >
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No attributes added yet</p>
                          <p className="text-sm">Add traits to make your NFT more discoverable</p>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div variants={fadeInUp} className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                      >
                        Continue
                      </button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 4: Pricing */}
                {currentStep === 4 && (
                  <motion.div variants={staggerContainer} className="space-y-6">
                    <motion.div variants={fadeInUp}>
                      <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Set Your Price
                      </label>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 mb-6">
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 text-lg">
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
                            className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
                          Price in USD (auto-converted to ETH during listing)
                        </p>
                      </div>

                      {/* NFT Summary */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">NFT Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Name:</span>
                            <span className="text-gray-900 dark:text-white font-medium">{formData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Category:</span>
                            <span className="text-gray-900 dark:text-white font-medium">{formData.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Attributes:</span>
                            <span className="text-gray-900 dark:text-white font-medium">{attributes.length} traits</span>
                          </div>
                          {previewUrl && (
                            <div className="mt-4">
                              <img
                                src={previewUrl}
                                alt="NFT Preview"
                                className="rounded-lg max-w-32 mx-auto"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                      >
                        Back
                      </button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.05 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Zap className="w-4 h-4" />
                            </motion.div>
                            {loadingMessage || 'Processing...'}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Create & List NFT
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}