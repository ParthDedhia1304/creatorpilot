"use client"

import { Button } from '@/components/ui/button'
import axios from 'axios';
import { Cog, Loader2, Search } from 'lucide-react'
import React, { useState } from 'react'
import KeyWordList from './_components/KeyWordList';
import { RunStatus } from '@/services/globalapi';

type Keywords={
  keyword:string;
  score:number;
  related_queries:string[];

}

export type SEOKeywordData={
  main_keyword:string;
  keywords:Keywords[];
}

export type KeywordList={
  keywordsData:SEOKeywordData
}
function TrendingKeywords() {

  const [userInput,setUserInput]=useState<string>();
  const [loading,setLoading]=useState(false);
  const [keywordsList,setKeywordsList]=useState<KeywordList>();
  const onFind=async ()=>{
    try {
      
      setLoading(true);
      const result=await axios.get('/api/trending-keywords?query='+userInput);
      console.log(result.data);
      while(true){
               console.log("Here")
               console.log(result.data.runId);
         
               const runStatus=await RunStatus(result.data.runId)
               console.log(runStatus)
               if(runStatus && runStatus[0]?.status=='Completed'){
                 console.log(runStatus[0]?.output[0]);
                setKeywordsList(runStatus[0]?.output[0]);
                 setLoading(false);
                 break;
               }
               if(runStatus && runStatus[0]?.status=='Cancelled'){
                 setLoading(false);
                 break;
               }
               await new Promise(resolve=>setTimeout(resolve,1000));
             }
    } catch (e) {
      setLoading(false);
    }
  }
  return (
    <div>
      <div className='px-10 md:px-20 lg:px-40'>
  <div className='flex items-center justify-center mt-20 flex-col gap-2'>
    <h2 className='font-bold text-4xl'>YouTube Trending Keywords </h2>
    <p className='text-gray-500 text-center'>
       Discover what’s hot — get instant access to YouTube's trending keywords and ride the viral wave.
    </p>
  </div>

  <div className='p-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5'>
    <input type='text' placeholder='Enter keywords which you want to find' 
    className='w-full p-2 outline-none bg-transparent'
    onChange={(event)=>setUserInput(event.target.value)}
    />
    <Button onClick={onFind} disabled={loading || !userInput}>
      {loading?<Loader2 className='animate-spin'/>:<Search/>}Search</Button>
  </div>
    </div>

    <KeyWordList loading={loading} keywordsList={keywordsList}/>
    </div>
  )
}

export default TrendingKeywords
