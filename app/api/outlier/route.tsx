import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){

      const { searchParams } = new URL(req.url);
  let query = searchParams.get("query");
   try {
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults: 20,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    const searchData = result.data;

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");
    console.log("Video IDs:", videoIds);
    console.log("Search Data:", searchData);

    const videoResults=await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`);

    const videoResultData=videoResults.data;

    const videos=videoResultData.items.map((item:any)=>{
      const today=new Date();

      const viewCount=parseInt(item.statistics.viewCount || "0");
      const likeCount=parseInt(item.statistics.likeCount || "0");
      const commentCount=parseInt(item.statistics.commentCount || "0");

      const publishDate=new Date(item.snippet.publishedAt);

      const daysSincePublished=Math.max((today.getTime()-publishDate.getTime())/(1000*60*60*24),1);
      const viewsPerDay=viewCount/daysSincePublished;
      const engagement=((likeCount+commentCount)/viewCount)*100;

      return{
     id: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    channelTitle: item.snippet.channelTitle,
    publishAt: item.snippet.publishedAt,
    viewCount,
    likeCount,
    commentCount,
    viewsPerDay,
    engagementRate: engagement,
      }

    })

    const viewCounts=videos.map((v:any)=>v.viewCount);
    const {iqr,lowerBound,upperBound}=calculateIQR(viewCounts);

    const avgViews=viewCounts.reduce((a:any,b:any)=>a+b,0)/viewCounts.length;
    const maxViewsPerDay=Math.max(...videos.map((v:any)=>v.viewsPerDay));
    const maxEngagementRate=Math.max(...videos.map((v:any)=>v.engagementRate));

    const finalResult=videos.map((v:any)=>{
      const isOutlier=v.viewCount<lowerBound || v.viewCount>upperBound;
      let outlierScore=0;

      if(isOutlier && iqr>0){
        if(v.viewCount>upperBound){
          outlierScore=(v.viewCount-upperBound)/iqr;

        }
        else if(v.viewCount<lowerBound){
          outlierScore=(lowerBound-v.viewCount)/iqr;

        }
      }

      const smartScore=
      (v.viewCount/avgViews)*0.5+
      (v.viewsPerDay/maxViewsPerDay)*0.3+
      (v.engagementRate/maxEngagementRate)*0.2;

      return {
        ...v,
        engagementRate:Number(v?.engagementRate?.toFixed(2)),//%
        viewsPerDay:Math.round(v?.viewsPerDay),
        smartScore:Number(smartScore?.toFixed(3)),
        isOutlier,
        outlierScore:Number(outlierScore?.toFixed(2)),
      };
    });





    return NextResponse.json(finalResult);

  } 
  catch (error: any) {
    console.error("YouTube API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}

function calculateIQR(values:number[]){

const sorted=[...values].sort((a,b)=>a-b);
const q1=sorted[Math.floor(sorted.length/4)];
const q3=sorted[Math.floor((sorted.length*3)/4)];
const iqr=q3-q1;
const lowerBound=q1-1.5*iqr;
const upperBound=q3+1.5*iqr;

  return {q1,q3,iqr,lowerBound,upperBound}; 
}
