import React from 'react'
import { KeywordList } from '../page'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

type Props = {
  keywordsList: KeywordList | undefined
  loading: boolean
}

function KeyWordList({ keywordsList, loading }: Props) {
  return (
    <div className="mt-8">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-10 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trending Keywords */}
          <div className="bg-[#1E1E2F] border border-[#2A2A3B] rounded-xl shadow-md p-6">
            <h2 className="font-semibold text-xl mb-4 text-white">
              🔥 Trending Keywords
            </h2>
            <div className="space-y-3">
              {keywordsList?.keywordsData.keywords?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center 
                             bg-[#2A2A3B] hover:bg-[#33334d] 
                             transition rounded-lg px-4 py-2 text-base text-gray-200"
                >
                  <span className="truncate">{item.keyword}</span>
                  <span className="bg-red-600 text-white text-sm font-semibold rounded-full px-3 py-1">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Queries */}
          <div className="bg-[#1E1E2F] border border-[#2A2A3B] rounded-xl shadow-md p-6">
            <h2 className="font-semibold text-xl mb-4 text-white">
              📈 Trending Queries
            </h2>
            <div className="flex flex-wrap gap-2">
              {keywordsList?.keywordsData.keywords?.flatMap((item) =>
                item.related_queries.map((query, i) => (
                  <Badge
                    key={`${item.keyword}-${query}-${i}`}
                    variant="secondary"
                    className="text-sm font-normal px-3 py-1 rounded-md 
                               bg-[#2A2A3B] text-gray-300 hover:bg-[#33334d]"
                  >
                    {query}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KeyWordList
