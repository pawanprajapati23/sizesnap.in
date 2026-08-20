'use client'
import { useState } from 'react'
import { Star, ThumbsUp } from 'lucide-react'

interface Props {
  ratingValue: string
  ratingCount: string
}

export default function ReviewWidget({ ratingValue, ratingCount }: Props) {
  const [voted, setVoted] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 my-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-yellow-50 border border-yellow-100 shrink-0">
          <span className="text-xl font-black text-yellow-600 leading-none">{ratingValue}</span>
          <div className="flex mt-1">
            <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
            <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
            <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
            <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
            <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Average User Rating</h4>
          <p className="text-sm text-gray-500">Based on <strong className="text-gray-700">{ratingCount}</strong> reviews from our users.</p>
        </div>
      </div>

      <div className="flex-shrink-0 w-full sm:w-auto">
        {!voted ? (
          <button
            onClick={() => setVoted(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg text-sm font-semibold text-gray-700 hover:text-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <ThumbsUp className="w-4 h-4" />
            Rate this tool helpful
          </button>
        ) : (
          <div className="px-5 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm font-semibold text-green-700 flex items-center justify-center gap-2">
            <span className="text-green-500">✔</span> Thanks for your feedback!
          </div>
        )}
      </div>
    </div>
  )
}
