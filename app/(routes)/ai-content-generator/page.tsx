"use client"

import { Button } from '@/components/ui/button'
import { RunStatus } from '@/services/globalapi';
import axios from 'axios';
import { Cog, Loader2, Search } from 'lucide-react';
import React, { useState } from 'react'
import ContentDisplay from './_components/ContentDisplay';
export type Content={
  id:number,
  userInput:string,
  content:subcontent,
  userEmail:string,
  thumbnailURL:string,
  createdOn:string
}
type subcontent={
  description:string ,
  thumbnail_prompt:string,
  tags:[],
  titles:[{
    seo_score:number,
    title:string
  }],
}


function AiContentGenerator() {
  const [userInput,setUserInput]=useState<string>();
  const [loading,setLoading]=useState(false);
  const [content,setContent]=useState<Content>();


  const onGenerate=async ()=>{
    try{
      setLoading(true);
    const result=await axios.post('/api/ai-content-generator',{
      userInput:userInput,
    })
    //setLoading(false);
    console.log(result.data);

      while(true){
          console.log("Here")
          console.log(result.data.runId);
    
          const runStatus=await RunStatus(result.data.runId)
          console.log(runStatus)
          if(runStatus && runStatus[0]?.status=='Completed'){
            console.log(runStatus[0]?.output[0]);
           setContent(runStatus[0]?.output[0]);
            setLoading(false);
            break;
          }
          if(runStatus && runStatus[0]?.status=='Cancelled'){
            setLoading(false);
            break;
          }
          await new Promise(resolve=>setTimeout(resolve,1000));
        }
  }
  catch(e){
    setLoading(false);
    console.log(e);
  }
}
  
  return (
    <div>
      <div className='px-10 md:px-20 lg:px-40'>
  <div className='flex items-center justify-center mt-20 flex-col gap-2'>
    <h2 className='font-bold text-4xl'>AI Content Generator</h2>
    <p className='text-gray-500 text-center'>
       Turn your ideas into ready-to-use content instantly — let AI do the heavy lifting.
    </p>
  </div>

  <div className='p-2 border rounded-xl flex gap-2 items-center bg-secondary mt-5'>
    <input type='text' placeholder='Enter value to generate content for your next video' 
    className='w-full p-2 outline-none bg-transparent'
    onChange={(event)=>setUserInput(event.target.value)}
    />
    <Button onClick={onGenerate} disabled={loading || !userInput}>
      {loading?<Loader2 className='animate-spin'/>:<Cog/>}Generate</Button>
  </div>
</div>

{/*@ts-ignore*/}

<ContentDisplay content={content} loading={loading}/>
</div>
  
  )
}

export default AiContentGenerator

