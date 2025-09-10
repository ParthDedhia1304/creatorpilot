import { openai } from "@/inngest/function";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let query = searchParams.get("query");
  const thumbnailUrl=searchParams.get('thumbnailUrl');

  if(thumbnailUrl){
    //AI model call
    const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.5-flash',
    max_tokens:256,
     messages:[
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": `Describe this thumbnail in short keywords suitable for searching similar Youtube Videos.
        Give me tags with comma separated.Donot give any comment text.
        Maximum 5 tags.
        Make sure after searching that tags will get similar youtube thumbnails`
        },
        {
          "type": "image_url",
          "image_url": {
            "url": thumbnailUrl
          }
        }
      ]
    }
  ],
  });

  const result=completion.choices[0].message.content;
  query=result;

  }
  console.log(query);
  if (!query) {
    return NextResponse.json({ error: "No query provided" }, { status: 400 });
  }

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

    const finalResult=videoResultData.items.map((item:any)=>({
        id:item.id,
        title:item.snippet.title,
        thumbnail:item.snippet.thumbnails.high.url,
        channelTitle:item.snippet.channelTitle,
        publishAt:item.snippet.publishAt,
        viewCount:item.statistics.viewCount,
        likeCount:item.statistics.likeCount,
        commentCount:item.statistics.commentCount,

    }))

    return NextResponse.json(finalResult);
  } catch (error: any) {
    console.error("YouTube API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}
