"use client";

import { RunStatus } from "@/services/globalapi";
import axios from "axios";
import { ArrowUp, ImagePlus, Loader2, User, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ThumbnailList from "./_components/ThumbnailList";
import { useAuth } from "@clerk/nextjs";

const AiThumbnailGenerator = () => {
  const [userInput, setUserInput] = useState<string>();
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);

  const [faceImagePreview, setFaceImagePreview] = useState<string>();
  const [referenceImagePreview, setReferenceImagePreview] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [outputThumbnailImage, setOutputThumbnailImage] = useState("");
  const { has } = useAuth();

  // File handler
  const onHandleFileChange = (field: string, e: any) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (field === "referenceImage") {
      setReferenceImage(selectedFile);
      setReferenceImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setFaceImage(selectedFile);
      setFaceImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  // Polling function with timeout
  const pollRunStatus = async (runId: string, attempt = 0, maxAttempts = 60) => {
    try {
      const runStatus = await RunStatus(runId);

      if (runStatus && runStatus[0]?.status === "Completed") {
        setOutputThumbnailImage(runStatus[0].output);
        setLoading(false);
        return;
      }

      if (runStatus && runStatus[0]?.status === "Cancelled") {
        setLoading(false);
        return;
      }

      if (attempt < maxAttempts) {
        setTimeout(() => pollRunStatus(runId, attempt + 1, maxAttempts), 1000);
      } else {
        console.error("Polling timed out after 60s");
        setLoading(false);
      }
    } catch (error) {
      console.error("Polling failed:", error);
      setLoading(false);
    }
  };

  // Submit Handler
  const onSubmit = async () => {
    setLoading(true);

    try {
      //@ts-ignore
      const hasPremium = has({ plan: "premium" });

      const formData = new FormData();
      if (userInput) formData.append("userInput", userInput);
      if (referenceImage) formData.append("referenceImage", referenceImage);
      if (faceImage) formData.append("faceImage", faceImage);

      const result = await axios.post("/api/generate-thumbnail", formData);

      // Start polling
      pollRunStatus(result.data.runId);
    } catch (e) {
      console.error("Error:", e);
      setLoading(false);
    }
  };

  return (
    <div className="px-10 md:px-20 lg:px-40">
      {/* Header */}
      <div className="flex items-center justify-center mt-20 flex-col gap-2">
        <h2 className="font-bold text-4xl">AI Thumbnail Generator</h2>
        <p className="text-gray-500 text-center">
          Turn any video into a click magnet with thumbnails that grab attention
          and drive views...
        </p>
      </div>

      {/* Loader or Output */}
      <div>
        {loading ? (
          <div className="w-full bg-secondary border rounded-2xl p-10 h-[250px] flex flex-col gap-3 items-center justify-center mt-6 text-center">
            <Loader2 className="animate-spin w-6 h-6" />
            <h2 className="font-medium">Please wait... Generating thumbnail</h2>
          </div>
        ) : (
          outputThumbnailImage && (
            <div className="mt-6 flex justify-center">
              <Image
                src={outputThumbnailImage}
                alt="Generated Thumbnail"
                width={420}
                height={280}
                className="rounded-2xl border shadow-lg w-full max-w-md aspect-video object-cover"
              />
            </div>
          )
        )}
      </div>

      {/* Input & Submit */}
      <div className="flex gap-5 items-center p-3 border rounded-xl mt-10 bg-secondary">
        <textarea
          placeholder="Enter your YouTube video title or description"
          className="w-full outline-none bg-transparent resize-none"
          rows={2}
          onChange={(event) => setUserInput(event.target.value)}
        />
        <div
          className="p-3 bg-gradient-to-t from-red-500 to-orange-500 rounded-full cursor-pointer hover:scale-105 transition"
          onClick={onSubmit}
        >
          <ArrowUp className="text-white" />
        </div>
      </div>

      {/* Uploads */}
      <div className="mt-3 flex gap-3">
        {/* Reference Image */}
        <label htmlFor="referenceImage" className="w-full">
          {!referenceImagePreview ? (
            <div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition cursor-pointer">
              <ImagePlus />
              <h2>Reference Image</h2>
            </div>
          ) : (
            <div className="relative inline-block">
              <X
                className="absolute -top-2 -right-2 bg-white rounded-full cursor-pointer"
                onClick={() => {
                  setReferenceImage(null);
                  setReferenceImagePreview(undefined);
                }}
              />
              <Image
                src={referenceImagePreview}
                alt="Reference Image"
                width={70}
                height={70}
                className="w-[70px] h-[70px] object-cover rounded-sm"
              />
            </div>
          )}
        </label>
        <input
          type="file"
          id="referenceImage"
          className="hidden"
          onChange={(e) => onHandleFileChange("referenceImage", e)}
        />

        {/* Face Image */}
        <label htmlFor="includeFace" className="w-full">
          {!faceImagePreview ? (
            <div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition cursor-pointer">
              <User />
              <h2>Include Face</h2>
            </div>
          ) : (
            <div className="relative inline-block">
              <X
                className="absolute -top-2 -right-2 bg-white rounded-full cursor-pointer"
                onClick={() => {
                  setFaceImage(null);
                  setFaceImagePreview(undefined);
                }}
              />
              <Image
                src={faceImagePreview}
                alt="Face Image"
                width={70}
                height={70}
                className="w-[70px] h-[70px] object-cover rounded-sm"
              />
            </div>
          )}
        </label>
        <input
          type="file"
          id="includeFace"
          className="hidden"
          onChange={(e) => onHandleFileChange("faceImage", e)}
        />
      </div>

      <ThumbnailList />
    </div>
  );
};

export default AiThumbnailGenerator;
