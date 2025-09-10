import { db } from "@/configs/db";
import { inngest } from "./client";
import ImageKit from "imagekit";
import OpenAI from "openai";
import { setPriority } from "os";
import Replicate from 'replicate';
import { AiContentTable, AiThumbnail, TrendingKeywordsTable } from "@/configs/schema";
import moment from "moment";
import { Result } from "postcss";
import axios from "axios";
import { jsonrepair } from 'jsonrepair';


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

const imageKit=new ImageKit({
  publicKey:process.env.IMAGEKIT_PUBLIC_KEY ||"",
  privateKey:process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint:process.env.IMAGEKIT_URLENDPOINT||"",
})


export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey:process.env.OPENROUTER_API_KEY,
  
})

export const replicate=new Replicate({
  auth:process.env.REPLICATE_API_KEY,
})

export const GenerateAiThumbnail=inngest.createFunction({
    id:'ai/generate-thumbnail'
},{event:'ai/generate-thumbnail'},
async({event,step})=>{
    const{userEmail,refImage,faceImage,userInput}=await event.data;

    //upload image to cloud /imagekit
    //  await step.sleep("wait-a-moment","7s");
    //  return "SuccessMan";
    const uploadImageUrls=await step.run(
      "UploadImage",
      async () => {
        if(refImage!=null){
        const refImageUrl=await imageKit.upload({
          file:refImage?.buffer??'',
          fileName:refImage.name,
          isPublished:true,
          useUniqueFileName:false

        })

        // const faceImageUrl=await imageKit.upload({
        //   file:faceImage?.buffer??'',
        //   fileName:faceImage.name,
        //   isPublished:true,
        //   useUniqueFileName:false

        // })

        return refImageUrl.url
      }
      else{
        return null;
      }   
      }
    );

//     //generate AI prompt from AI model

    const generateThumbnailPrompt=await step.run('generateThumbnailPrompt',async()=>{
       const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    max_tokens: 1024,
    messages: [
      { role: "user", 
        content:[
        {
          "type": "text",
          "text":uploadImageUrls? `Refering to this thumbnail url write a text prompt to generate thumbnail 
          similar to the attached reference image with the following user input: `+userInput+` Only give me text prompt, No other comment text` :
          `Depends on user input write a text prompt to generate high quality professional Youtube Thumbnail 
          Add a relevant icons,illustration or images as per title. UserInput`+userInput+` Only give me text prompt, No other comment text`
        },
        //@ts-ignore
        ...(uploadImageUrls
          ? [
            {
          type: "image_url",
          image_url: {
            url: uploadImageUrls,
          },
        },
          ]
          :[]
        )
      ],
     },
    ],

  });
  console.log('Token usage:', completion.usage); // Some APIs return this

  console.log(completion.choices[0].message.content);
  return completion.choices[0].message.content;
    });

//     //Generate AI image

    const generateThumbnailImage=await step.run('Generate Image',async()=>{
      const input = {
    prompt:generateThumbnailPrompt,
    aspect_ratio: "16:9",
    output_format:"png",
    safety_filter_level: "block_only_high"
};
const output = await replicate.run("google/imagen-4", { input });
//@ts-ignore
return output.url();

    });

//     //Save image to Cloud

    const uploadThumbnail=await step.run('Upload Thumbnail',async()=>{

      const imageRef=await imageKit.upload({
        file:generateThumbnailImage,
        fileName:Date.now()+'.png',
        isPublished:true,
        useUniqueFileName:false,
      })
      return imageRef.url
    });

//     //Save record to db

    const saveToDB=await step.run('SaveToDB',async()=>{
      const result=await db.insert(AiThumbnail).values({
        userInput:userInput,
        thumbnailURL:uploadThumbnail,
        createdOn:moment().format('yyyy-mm-DD'),
        refImage:uploadImageUrls,
        userEmail:userEmail
        //@ts-ignore
      }).returning(AiThumbnail)
      return result;
    })
   return uploadThumbnail;
}
)

const AIContentGeneratorSystemPrompt=
`
You are an expert YouTube content strategist and SEO specialist.

Your task is to generate content for a YouTube video on the topic: "{topic}".

✅ Return the output as a single, complete, and valid JSON block — no commentary or markdown.
❌ Do not include "Here is your JSON:" or \`\`\`json markers.
⚠️ Do not leave the JSON incomplete or truncate the output.

The required JSON format is:

{
  "titles": [
    { "title": "string", "seo_score": number (0-100) },
    ...
  ],
  "description": "string (SEO-optimized, 100-200 words)",
  "tags": ["string", "string", ...],
  "thumbnail_prompt": "string (prompt to generate a YouTube thumbnail image)"
}

🧠 Notes:
- Generate 3–5 catchy titles optimized for CTR and SEO.
- Tags should be 8–12 keywords relevant to the topic.
- The thumbnail_prompt should describe a scene that grabs attention visually and relates to the topic.
- Ensure valid JSON only (no markdown, no explanation).

Begin now. Output only the JSON.

`.trim();

export const GenerateAiContent=inngest.createFunction(
  {id:'ai/generateContent'},
  {event:'ai/generateContent'},

  async({event,step})=>{
    const { userInput: rawInput, userEmail } = await event.data;
  const userInput = typeof rawInput === 'string' ? rawInput : rawInput?.userInput || '';

  if (!userInput) throw new Error("Invalid userInput received.");


    //To generate Title,Description,tags and thumbnail prompt
    const generateAiContent=await step.run('GenerateAiContent',async()=>{
      const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "user", 
        content: AIContentGeneratorSystemPrompt.replace('{topic}',userInput),
      }
    ],
     max_tokens: 512,
  });
  const rawjson = completion.choices?.[0]?.message?.content || '';

if (!rawjson) {
  throw new Error("AI did not return any content.");
}

// Clean the response
const formattedJsonString = rawjson
  .replace(/```json|```/g, '')
  .trim()
  .replace(/^.*?({[\s\S]*})[\s\S]*$/, '$1');

let formattedJson = null;
try {
  formattedJson = JSON.parse(formattedJsonString);
} catch (err) {
  console.error("Failed to parse AI JSON:", formattedJsonString);
  throw new Error("AI returned invalid JSON.");
}

return formattedJson;

    })
    //To generate thumbail prompt

      const generateThumbnailImage=await step.run('Generate Image',async()=>{
      const input = {
    prompt:generateAiContent?.thumbnail_prompt,
    aspect_ratio: "16:9",
    output_format:"png",
    safety_filter_level: "block_only_high"
};
const output = await replicate.run("google/imagen-4", { input });
//@ts-ignore
return output.url();

    });

//     //Save image to Cloud

    const uploadThumbnail=await step.run('Upload Thumbnail',async()=>{

      const imageRef=await imageKit.upload({
        file:generateThumbnailImage,
        fileName:Date.now()+'.png',
        isPublished:true,
        useUniqueFileName:false,
      })
      return imageRef.url
    });
    //Save everything to db

    const saveContentDB=await step.run('SaveToDB',async()=>{
      const result=await db.insert(AiContentTable).values({
        content:generateAiContent,
        createdOn:moment().format('yyyy-mm-DD'),
        thumbnailURL:uploadThumbnail,
        userEmail:userEmail,
        userInput:userInput
        //@ts-ignore
      }).returning(AiContentTable);
      return result;
    })
    return saveContentDB;
  }
)

export const GetTrendingKeywords=inngest.createFunction(
  {id:'ai/trending-keywords'},
{event:'ai/trending-keywords'},
async({event,step})=>{
  const {userInput,userEmail}=await event.data;

  //Get google search result using bright data

  const GoogleSearchQuery = await step.run('GoogleSearchResult', async () => {
  const resp = await axios.post(
    'https://api.brightdata.com/request',
    {
      zone: 'creatorpilot',
      url: 'https://www.google.com/search?q=' + userInput?.replaceAll(' ', '') + '&tbm=vid&brd_json=1',
      format: 'json',
    },
    {
      headers: {
        Authorization: 'Bearer ' + process.env.BRIGHTDATA_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = resp.data;

  // 👇 Safe parsing
  let nestedjson;
  if (data?.body) {
    try {
      nestedjson = JSON.parse(data.body);
    } catch (err) {
      console.error("❌ Failed to parse BrightData body:", data.body);
      throw new Error("BrightData returned invalid JSON.");
    }
  } else {
    nestedjson = data; // already JSON
  }

  let titles: string[] = [];
  nestedjson?.organic?.forEach((element: any) => {
    titles.push(element?.title);
  });

  return titles;
});


 


  //Get youtube search result using Youtube Api
   const YoutubeResult=await step.run('Youtube Result',async()=>{
   const result = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: "snippet",
        q: userInput,
        type: "video",
        maxResults: 20,
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    const searchData=result.data;
    let titles:any=[];

    searchData?.items.forEach((item:any)=>{
      titles.push(item?.snippet?.title)
    })
    return titles;
  })
  //AI model to generate keywords

  const KeywordsList=await step.run('generateKeywords',async()=>{

    const SystemPromptForKeywords= `
        Given the user input: {{userInput}}  
And the following list of YouTube video titles: {{titles}}  

Extract **high-ranking, SEO-relevant keywords** related to the user input. For each keyword:

1. Assign an **SEO score** from 1 to 100 based on search potential and relevance.
2. Include a few **related queries** or search phrases that reflect user intent or title variations.

📦 Return the output in this strict JSON format:
{
  "main_keyword": "{{userInput}}",
  "keywords": [
    {
      "keyword": "Extracted Keyword",
      "score": NumericScore,
      "related_queries": [
        "related query 1",
        "related query 2"
      ]
    },
    ...
  ]
}

🔍 Use only keywords relevant to the main topic. Keep keywords **concise**, **focused**, and **action-oriented**.
🚫 Avoid unrelated terms or generic SEO phrases not relevant to {{userInput}}.


`
      const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "user", 
        content:SystemPromptForKeywords.replace('{{userInput}}',userInput).replace('{{titles}}',JSON.stringify(GoogleSearchQuery)+JSON.stringify(YoutubeResult)),
      }
    ],
     max_tokens: 512,
  });

   const rawjson = completion.choices?.[0]?.message?.content || '';

   if (!rawjson) {
  throw new Error("AI did not return any content.");
}

// Clean the response
const formattedJsonString = rawjson
  .replace(/```json|```/g, '')
  .trim()
  .replace(/^.*?({[\s\S]*})[\s\S]*$/, '$1');

let formattedJson = null;
try {
  formattedJson = JSON.parse(formattedJsonString);
} catch (err) {
  try {
    // Try to repair and parse the malformed JSON
    formattedJson = JSON.parse(jsonrepair(formattedJsonString));
  } catch (repairErr) {
    console.error("Failed to repair AI JSON:", formattedJsonString);
    throw new Error("AI returned invalid JSON.");
  }
}

return formattedJson;

  
  })
  //Save to db
  const SaveToDB=await step.run('SaveToDB',async()=>{
    const result=await db.insert(TrendingKeywordsTable).values({
      keywordsData:KeywordsList,
      userEmail:userEmail,
      createdOn:moment().format('yyyy-mm-DD'),
      userInput:userInput
//@ts-ignore
    }).returning(TrendingKeywordsTable);
    return result
  })

return SaveToDB
}

)


