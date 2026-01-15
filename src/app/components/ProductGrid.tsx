// app/components/ProductGrid.tsx

'use client';

import { ProductScore } from '@/services/searchSocketService';


interface Product {
  id: string;
  title: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  productUrl?: string;
  source: string;
  rating?: number;
  reviewCount?: number;
  isSponsored?: boolean;
  badge?: string;
  condition?: string;
  shipping?: string;
  hasFreeShipping?: boolean;
}

interface ProductGridProps {
  products: Product[];
  scores?: ProductScore[];
  showScores?: boolean;
}

export default function ProductGrid({ 
  products, 
  scores = [], 
  showScores = false 
}: ProductGridProps) {
  
  // Helper to get score for a product
  const getProductScore = (productId: string): ProductScore | undefined => {
    return scores.find(s => s.productId === productId);
  };

  // Helper to format score color
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Helper to get score label
  const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => {
        const score = getProductScore(product.id);
        const relevanceScore = score?.relevanceScore || 0;
        const aiReasoning = score?.aiReasoning || '';

        return (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group relative"
          >
            {/* AI Score Badge - Top Right */}
            {showScores && score && (
              <div className="absolute top-3 right-3 z-10">
                <div 
                  className={`${getScoreColor(relevanceScore)} text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1`}
                  title={aiReasoning}
                >
                  <svg   aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {relevanceScore}
                </div>
              </div>
            )}

            {/* Ranking Number - Top Left */}
            {showScores && (
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-gray-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  #{index + 1}
                </div>
              </div>
            )}

            {/* Product Image */}
            <div className="relative h-64 bg-gray-100 overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.png';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg  aria-hidden="true" className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Source Badge */}
              <div className="absolute bottom-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-md">
                  {product.source}
                </span>
              </div>

              {/* Sponsored Badge */}
              {product.isSponsored && (
                <div className="absolute bottom-3 right-3">
                  <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                    SPONSORED
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5">
              {/* Title */}
              <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>

              {/* AI Reasoning - Only show when scores are visible */}
              {showScores && aiReasoning && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg  aria-hidden="true" className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-xs font-semibold text-blue-700 mb-1">
                        {getScoreLabel(relevanceScore)}
                      </p>
                      <p className="text-xs text-blue-600 leading-relaxed">
                        {aiReasoning}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mb-3">
                <span className="text-2xl font-bold text-gray-900">
                  {product.currency || '$'}{product.price}
                </span>
              </div>

              {/* Rating & Reviews */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                       aria-hidden="true"
                        key={i}
                        className={`w-4 h-4 ${
                          Math.floor(product.rating ?? 0)

                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating}
                  </span>
                  {product.reviewCount && (
                    <span className="text-xs text-gray-500">
                      ({product.reviewCount.toLocaleString()} reviews)
                    </span>
                  )}
                </div>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.condition && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {product.condition}
                  </span>
                )}
                {product.hasFreeShipping && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                    Free Shipping
                  </span>
                )}
                {product.badge && product.badge !== 'N/A' && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* View Product Button */}
              {product.productUrl && (
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  View Product
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}