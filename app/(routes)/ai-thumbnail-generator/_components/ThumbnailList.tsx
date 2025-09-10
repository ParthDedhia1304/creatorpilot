import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { eq, desc } from "drizzle-orm";

type Thumbnail={
    id:number,
    thumbnailURL:string,
    refImage:string,
    userInput:string
}
function ThumbnailList() {

    const [ThumbnailList,setThumbnailList]=useState<Thumbnail[]>([]);
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        getThumbnailList();
    },[]);
    const getThumbnailList=async ()=>{
        setLoading(true);
        const result=await axios.get('/api/generate-thumbnail');
        console.log(result.data);
        setThumbnailList(result.data);
        setLoading(false);
    }
  return (
    <div className="mt-10">
  <h2 className="font-bold text-xl mb-4">
    Previously generated Thumbnails
  </h2>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {!loading
      ? ThumbnailList.map((thumbnail, index) => (
          <Link href={thumbnail.thumbnailURL} target="_blank" key={index}>
            <Image
              src={thumbnail.thumbnailURL}
              alt={thumbnail.thumbnailURL}
              width={300}
              height={200}
              className="w-full aspect-video rounded-xl object-cover transition-transform hover:scale-105 duration-200"
            />
          </Link>
        ))
      : Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2 animate-pulse">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
  </div>
</div>

  )
}

export default ThumbnailList;
