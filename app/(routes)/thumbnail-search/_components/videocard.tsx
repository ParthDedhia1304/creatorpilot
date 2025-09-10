import React from 'react'
import { videoInfo } from '../page'
import Image from 'next/image'
import { Eye, Heart } from 'lucide-react'
type Props={
    videoInfo:videoInfo
}
function VideoCard({videoInfo}:Props) {
    
  return (
    
    <div className='p-3 border rounded-2xl cursor-pointer hover:scale-105 transition-all'>
      <Image src={videoInfo.thumbnail} alt={videoInfo.title} 
      width={300} 
      height={300}
      className='rounded-xl aspect-video object-cover'/>

      <h2>{videoInfo.title}</h2>
      <h2 className='text-xs text-gray-600'>{videoInfo.channelTitle}</h2>
      <div className='flex justify-between items-center mt-1'>
        <h2 className='flex text-xs gap-2 items-center text-gray-600'><Eye className='h-4 w-4'/>{videoInfo.viewCount}</h2>
        <h2 className='flex text-xs gap-2 items-center text-gray-600'><Heart className='h-4 w-4 fill-red-500'/>{videoInfo.likeCount}</h2>
      </div>
    </div>
  )
}

export default VideoCard
