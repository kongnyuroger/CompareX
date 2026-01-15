// app/components/AIScoreSummary.tsx

'use client';

import { ProductScore } from '@/services/searchSocketService';
import { useMemo } from 'react';

interface AIScoreSummaryProps {
  scores: ProductScore[];
  totalProducts: number;
}

export default function AIScoreSummary({ scores, totalProducts }: AIScoreSummaryProps) {
  const stats = useMemo(() => {
    if (scores.length === 0) return null;

    const scoreValues = scores.map(s => s.relevanceScore);
    const avgScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
    const maxScore = Math.max(...scoreValues);
    const minScore = Math.min(...scoreValues);
    
    // Count by score ranges
    const excellent = scoreValues.filter(s => s >= 90).length;
    const great = scoreValues.filter(s => s >= 80 && s < 90).length;
    const good = scoreValues.filter(s => s >= 70 && s < 80).length;
    const fair = scoreValues.filter(s => s >= 60 && s < 70).length;
    const poor = scoreValues.filter(s => s < 60).length;

    return {
      avgScore,
      maxScore,
      minScore,
      excellent,
      great,
      good,
      fair,
      poor,
    };
  }, [scores]);

  if (!stats) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 mb-8 border border-blue-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-500 text-white p-3 rounded-xl">
          <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">AI Ranking Summary</h3>
          <p className="text-sm text-gray-600">
            Analyzed {totalProducts} products with AI-powered relevance scoring
          </p>
        </div>
      </div>

      {/* Score Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Average Score</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.avgScore.toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Highest Score</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.maxScore}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Lowest Score</p>
          <p className="text-2xl font-bold text-orange-600">
            {stats.minScore}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Total Ranked</p>
          <p className="text-2xl font-bold text-purple-600">
            {scores.length}
          </p>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Score Distribution</h4>
        <div className="space-y-3">
          {stats.excellent > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700">
                Excellent (90+)
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(stats.excellent / scores.length) * 100}%` }}
                >
                  <span className="text-xs text-white font-bold">{stats.excellent}</span>
                </div>
              </div>
            </div>
          )}
          
          {stats.great > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700">
                Great (80-89)
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(stats.great / scores.length) * 100}%` }}
                >
                  <span className="text-xs text-white font-bold">{stats.great}</span>
                </div>
              </div>
            </div>
          )}
          
          {stats.good > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700">
                Good (70-79)
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(stats.good / scores.length) * 100}%` }}
                >
                  <span className="text-xs text-white font-bold">{stats.good}</span>
                </div>
              </div>
            </div>
          )}
          
          {stats.fair > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700">
                Fair (60-69)
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(stats.fair / scores.length) * 100}%` }}
                >
                  <span className="text-xs text-white font-bold">{stats.fair}</span>
                </div>
              </div>
            </div>
          )}
          
          {stats.poor > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-medium text-gray-700">
                Poor (&lt;60)
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${(stats.poor / scores.length) * 100}%` }}
                >
                  <span className="text-xs text-white font-bold">{stats.poor}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>How it works:</strong> Our AI analyzes each product against your search query, 
          considering relevance, features, and user intent to assign a score from 0-100. 
          Higher scores indicate better matches.
        </p>
      </div>
    </div>
  );
}