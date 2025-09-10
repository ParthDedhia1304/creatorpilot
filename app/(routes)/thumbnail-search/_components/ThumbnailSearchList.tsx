import React from 'react'
import { videoInfo } from '../page'
import VideoCard from './videocard'
type Props={
    videoList:videoInfo[] |undefined,
    searchSimilarThumbnail:any
}
function ThumbnailSearchList({videoList,searchSimilarThumbnail}:Props) {

   
  return (
    
    <div className='mt-7'>  
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {videoList && videoList.map((video,index)=>(
            <div onClick={()=>searchSimilarThumbnail(video.thumbnail)}>
            <VideoCard videoInfo={video} key={index}/>
            </div>
        ))}

      </div>

    </div>
  )
}

export default ThumbnailSearchList
