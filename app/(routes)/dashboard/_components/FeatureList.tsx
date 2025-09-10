
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const features=[
    {
        id:1,
        title:'AI Thumbnail Generator',
        image:'/feature1.png',
        path:'/ai-thumbnail-generator'
    },
    {
        id:2,
        title:'AI Thumbnail Search',
        image:'/feature2.png',
        path:'/thumbnail-search'
    },
    {
        id:3,
        title:'Content Generator',
        image:'/feature4.png',
        path:'/ai-content-generator'
    },
    {
        id:4,
        title:'Outlier',
        image:'/feature3.png',
        path:'/outlier'
    },
    {
        id:5,
        title:'Trending Keywords',
        image:'/feature5.png',
        path:'/trending-keywords'
    },
   
]
const FeatureList = () => {
  return (
    <div className='mt-7'>
      <h2 className='font-bold text-2xl'>AI-Tools</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {features.map((feature,index)=>(
            <Link href={feature.path} key={feature.id}>
            <div className="relative w-full h-[150px]">
  
  
  
        <Image src={feature.image} alt={feature.title}
        width={200}
        height={200}
        className='w-full h-[150px] object-cover aspect-video rounded-xl hover:scale-105 transition-all cursor-pointer'/>
</div>


            </Link>
        ))}
      </div>
    </div>
  )
}

export default FeatureList
