import { db } from "@/configs/db";
import { AiThumbnail } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { File } from "buffer";
import { eq ,desc} from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const formData=await req.formData();
    const refImage=formData.get('referenceImage') as File |null;
    const faceImage=formData.get('faceImage') as File | null;

    const userInput=formData.get('userInput');

    const user=await currentUser();

    const inputData={
        userInput:userInput,
        refImage:refImage?await  getFileBufferData(refImage):null,
        faceImage:faceImage?await getFileBufferData(faceImage):null,
        userEmail:user?.primaryEmailAddress?.emailAddress,

    }
    const result=await inngest.send({
    name: "ai/generate-thumbnail",
    data: inputData
  });
  return NextResponse.json({runId:result.ids[0]});
    
}

const getFileBufferData=async(file:File)=>{
    const bytes=await file.arrayBuffer();
    const buffer=Buffer.from(bytes);
    return {
        name: file.name,
        type: file.type,
        size: file.size,
        buffer: buffer.toString('base64'),
    }
}

export async function GET(req:NextRequest) {
    const user=await currentUser();
    //@ts-ignore
    const result=await db.select().from(AiThumbnail).where(eq(AiThumbnail.userEmail,user?.primaryEmailAddress?.emailAddress)).orderBy(desc(AiThumbnail.id));
    return NextResponse.json(result);
}