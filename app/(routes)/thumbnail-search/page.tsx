
"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Loader2, Search } from 'lucide-react'
import React, { useState } from 'react'
import ThumbnailSearchList from './_components/ThumbnailSearchList';
import { Skeleton } from '@/components/ui/skeleton';
export type videoInfo={
  id:string,
  title:string,
  thumbnail:string,
  description:string,
  channelTitle:string,
  publishedAt:string,
  viewCount:string,
  likeCount:string,
  commentCount:string,

}

function ThumbnailSearch() {

  const [userInput,setUserInput]=useState<string>();

  const [loading,setLoading]=useState(false);

  const [videoList,setVideoList]=useState<videoInfo[]>();

  const onSearch=async ()=>{
    setLoading(true);
const result=await axios.get('/api/thumbnail-search?query='+userInput);

console.log(result.data);
setLoading(false);
setVideoList(result.data);

  }

  const searchSimilarThumbnail=async (url:string)=>{
    setLoading(true);
const result=await axios.get('/api/thumbnail-search?thumbnailUrl='+url);

console.log(result.data);
setLoading(false);
setVideoList(result.data);
  }


  return (
    <div>
    <div className='px-10 md:px-20 lg:px-40'>
  <div className='flex items-center justify-center mt-20 flex-col gap-2'>
    <h2 className='font-bold text-4xl'>Smart Thumbnail Search</h2>
    <p className='text-gray-500 text-center'>
      Quickly find the perfect thumbnail using AI-powered face and reference image search — no more endless scrolling through frames.
    </p>
  </div>

  <div className='p-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5'>
    <input type='text' placeholder='Enter value to search' 
    className='w-full p-2 outline-none bg-transparent'
    onChange={(event)=>setUserInput(event.target.value)}
    />
    <Button onClick={onSearch} disabled={loading || !userInput}>
      {loading?<Loader2 className='animate-spin'/>:<Search/>}Search</Button>
  </div>
</div>


<div>
  {loading ?
  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5'>
    {
  [1,2,3,4,5,6,7,8,9].map((item,index)=>(
   
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ))}</div>
:
<ThumbnailSearchList videoList={videoList}
searchSimilarThumbnail={(url:string)=>searchSimilarThumbnail(url)}/>
}
</div>
</div>

  )
}

export default ThumbnailSearch
