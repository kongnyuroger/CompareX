// app/components/ScoreComparisonView.tsx

'use client';

import { ProductScore } from '@/services/searchSocketService';
import { useMemo, useState } from 'react';
import Image from 'next/image';

interface Product {
  id: string;
  title: string;
  price: number;
  source: string;
  imageUrl?: string;
}

interface ScoreComparisonViewProps {
  products: Product[];
  scores: ProductScore[];
}

export default function ScoreComparisonView({ products, scores }: ScoreComparisonViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get top 10 products by score
  const topProducts = useMemo(() => {
    return [...products]
      .map(product => {
        const score = scores.find(s => s.productId === product.id);
        return {
          ...product,
          score: score?.relevanceScore || 0,
          reasoning: score?.aiReasoning || '',
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [products, scores]);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBarColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="mb-6">
      <button 
      type='button'
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 hover:from-purple-100 hover:to-pink-100 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 text-white p-2 rounded-lg">
              <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">View Detailed AI Scores</h3>
              <p className="text-sm text-gray-600">
                See rankings and reasoning for top {topProducts.length} products
              </p>
            </div>
          </div>
          <svg 

            aria-hidden="true"
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
            <h4 className="font-bold text-lg">Top Products by AI Score</h4>
            <p className="text-sm opacity-90">Ranked by relevance to your search query</p>
          </div>

          <div className="divide-y divide-gray-100">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex gap-4">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-100 text-gray-600'
                    } flex items-center justify-center font-bold text-lg shadow-md`}>
                      #{index + 1}
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg aria-hidden="true" className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                      {product.title}
                    </h5>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-xs text-gray-500">
                        from {product.source}
                      </span>
                    </div>

                    {/* Score Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">Relevance Score</span>
                        <span className={`font-bold px-2 py-0.5 rounded-full ${getScoreColor(product.score)}`}>
                          {product.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${getScoreBarColor(product.score)} transition-all duration-500`}
                          style={{ width: `${product.score}%` }}
                        />
                      </div>
                    </div>

                    {/* AI Reasoning */}
                    {product.reasoning && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                        <p className="text-xs text-blue-800 leading-relaxed">
                          <span className="font-semibold">AI Analysis:</span> {product.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-600">
              Showing top {topProducts.length} of {products.length} products
            </p>
          </div>
        </div>
      )}
    </div>
  );
}