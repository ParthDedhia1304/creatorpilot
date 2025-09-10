import React from 'react'
import { videoInfo } from '../page'
import Image from 'next/image'
import { Eye, Heart, ThumbsUp } from 'lucide-react'
import { videoInfoOutlierType } from '../../outlier/page'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
type Props={
    videoInfo:videoInfoOutlierType
}
function VideoOutlierCard({videoInfo}:Props) {
    
  return (

    
    <div className='p-3 border rounded-2xl cursor-pointer  transition-all relative'>
        <Tooltip>
  <TooltipTrigger asChild>
     <h2 className='absolute right-3 p-1 bg-purple-500 text-white rounded-sm'>{videoInfo.smartScore}x</h2>
  </TooltipTrigger>
  <TooltipContent className='bg-purple-500'>
    <p>Outlier And Smart Score</p>
  </TooltipContent>
</Tooltip>
       
      <Image src={videoInfo.thumbnail} alt={videoInfo.title} 
      width={300} 
      height={300}
      className='rounded-xl aspect-video object-cover'/>

      <h2>{videoInfo.title}</h2>
      <h2 className='text-xs text-gray-600'>{videoInfo.channelTitle}</h2>
      <div className='flex justify-between items-center mt-1'>
        <h2 className='flex text-xs gap-2 items-center text-gray-600'><Eye className='h-4 w-4'/>{videoInfo.viewCount}</h2>
           <Tooltip>
  <TooltipTrigger asChild>
    <h2 className='flex text-xs gap-2 items-center text-white bg-red-500 p-1 rounded-sm'><ThumbsUp className='h-4 w-4'/>{videoInfo.engagementRate}</h2>
    </TooltipTrigger>
  <TooltipContent className='bg-red-500'>
    <p>Engagemnt Rate</p>
  </TooltipContent>
</Tooltip>
        
      </div>
    </div>
  )
}

export default VideoOutlierCard
