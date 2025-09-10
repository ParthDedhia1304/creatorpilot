"use client"

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2, Search } from 'lucide-react';
import React, { useState } from 'react'

import VideoOutlierCard from '../thumbnail-search/_components/VideoOutlierCard';
import VideoListSkeleton from '@/app/_components/VideoListSkeleton';
export type videoInfoOutlierType={
  id:string,
  title:string,
  thumbnail:string,
  description:string,
  channelTitle:string,
  publishedAt:string,
  viewCount:number,
  likeCount:number,
  commentCount:number,
  smartScore:number,
  viewsPerDay:number,
  isOutlier:boolean,
  engagementRate:number,
  outlierScore:number,

}

function Outlier() {
    const [userInput,setUserInput]=useState<string>();
     const [loading,setLoading]=useState(false);
     const [videoList,setVideoList]=useState<videoInfoOutlierType[]>();

    const onSearch=async ()=>{
      try{
        setLoading(true);
const result=await axios.get('/api/outlier?query='+userInput);

console.log(result.data);
setVideoList(result.data);
setLoading(false);
    }
    catch(e){
      setLoading(false);
    }
    }

  return (
    <div>
       <div className='px-10 md:px-20 lg:px-40'>
  <div className='flex items-center justify-center mt-20 flex-col gap-2'>
    <h2 className='font-bold text-4xl'>Outlier</h2>
    <p className='text-gray-500 text-center'>
      Discover standout videos by spotting outliers in views,likes, and engagement.Analyse your video's performance with start scoring to optimize growth and reach
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
{!loading ? <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-7'>
  {videoList?.map((video,index)=>(
    <div key={index}>
      <VideoOutlierCard videoInfo={video}/>
    </div>
  ))}
</div>:<VideoListSkeleton/>}
    </div>
  )
}

export default Outlier
