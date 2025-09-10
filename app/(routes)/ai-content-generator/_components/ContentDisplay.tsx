import React from 'react'
import { Content } from '../page'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  content: Content,
  loading: boolean
}

function ContentDisplay({ content, loading }: Props) {
  if (loading) {
    return (
      <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-[200px] w-full rounded-xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='mt-10 grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* Titles */}
      <div className='bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 transition-colors'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>
          🎯 YouTube Video Title Suggestions
        </h2>
        <div className='space-y-3'>
          {content?.content?.titles?.map((item: any, index: number) => (
            <div
              key={index}
              className='flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm transition-colors'
            >
              <span className='text-gray-700 dark:text-gray-200 font-medium'>{item?.title}</span>
              <span className='text-sm bg-blue-100 dark:bg-blue-900 dark:text-blue-300 text-blue-600 px-2 py-1 rounded-full font-bold'>
                {item?.seo_score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className='bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 transition-colors'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3'>
          📝 YouTube Video Description
        </h2>
        <p className='text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line'>
          {content?.content?.description || 'No description available.'}
        </p>
      </div>

      {/* Tags */}
      <div className='bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 transition-colors'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3'>
          🔖 Suggested Tags
        </h2>
        <div className='flex flex-wrap gap-2'>
          {content?.content?.tags?.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className='text-sm bg-gray-100 dark:bg-gray-800 dark:text-gray-200'
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Thumbnail */}
      <div className='bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 transition-colors'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3'>
          🖼️ Thumbnail Preview
        </h2>
        {content?.thumbnailURL ? (
          <Link href={content?.thumbnailURL} target='_blank'>
            <Image
              src={content.thumbnailURL}
              alt='Thumbnail'
              width={400}
              height={225}
              className='rounded-xl w-full aspect-video object-cover'
            />
          </Link>
        ) : (
          <div className='w-full aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500'>
            No thumbnail available
          </div>
        )}
      </div>
    </div>
  )
}

export default ContentDisplay
