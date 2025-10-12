import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Discover, Collect, and Sell NFTs
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The world's first and largest digital marketplace for crypto collectibles
          </p>
          <button className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
            Explore NFTs
          </button>
        </div>

        {/* Featured Collections Placeholder */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Collection {i}</h3>
                  <p className="text-gray-600">Featured NFT collection</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
