"use client"

import { RunStatus } from '@/services/globalapi';
import axios from 'axios';
import { ArrowUp, ImagePlus, Loader2, User, X } from 'lucide-react'
import Image from 'next/image';
import { useState } from 'react';
import ThumbnailList from './_components/ThumbnailList';
import { useAuth } from '@clerk/nextjs';

const AiThumbnailGenerator = () => {
  const [userInput, setUserInput] = useState<string>();
  const [referenceImage, setReferenceImage] = useState<any>();
  const [faceImage, setFaceImage] = useState<any>();
  const [faceImagePreview, setFaceImagePreview] = useState<string>();
  const [referenceImagePreview, setReferenceImagePreview] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [outputThumbnailImage, setOutputThumbnailImage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { has } = useAuth();

  const onHandleFileChange = (field: string, e: any) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (field === 'referenceImage') {
      setReferenceImage(selectedFile);
      setReferenceImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setFaceImage(selectedFile);
      setFaceImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const pollRunStatus = async (runId: string, maxAttempts = 30, interval = 2000) => {
    let attempts = 0;

    return new Promise<string>((resolve, reject) => {
      const checkStatus = async () => {
        attempts++;

        try {
          const runStatus = await RunStatus(runId);
          const status = runStatus?.[0]?.status;

          console.log(`Polling attempt ${attempts}:`, status);

          if (status === 'Completed') {
            const output = runStatus[0].output;
            return resolve(`${output}?t=${Date.now()}`); // cache-bust
          }

          if (status === 'Cancelled' || status === 'Failed') {
            return reject(new Error(`Run ${status}`));
          }

          if (attempts < maxAttempts) {
            setTimeout(checkStatus, interval);
          } else {
            return reject(new Error("Polling timed out"));
          }
        } catch (err) {
          return reject(err);
        }
      };

      checkStatus();
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setOutputThumbnailImage('');

    try {
      const formData = new FormData();
      userInput && formData.append('userInput', userInput);
      referenceImage && formData.append('referenceImage', referenceImage);
      faceImage && formData.append('faceImage', faceImage);

      const result = await axios.post('/api/generate-thumbnail', formData);
      const runId = result.data.runId;

      const finalImage = await pollRunStatus(runId);
      setOutputThumbnailImage(finalImage);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while generating thumbnail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px:10 md:px:20 lg-px:40">
      {/* Heading */}
      <div className="flex items-center justify-center mt-20 flex-col gap-2">
        <h2 className="font-bold text-4xl">AI Thumbnail Generator</h2>
        <p className="text-gray-500 text-center">
          Turn any video into a click magnet with thumbnails that grab attention and drive views...
        </p>
      </div>

      {/* Loader / Output */}
      <div>
        {loading ? (
          <div className="w-full bg-secondary border rounded-2xl p-10 h-[250px] flex flex-col gap-3 items-center justify-center mt-6">
            <Loader2 className="animate-spin" />
            <h2>Generating thumbnail, please wait...</h2>
          </div>
        ) : outputThumbnailImage ? (
          <div className="mt-6 flex justify-center">
            <Image
              src={outputThumbnailImage}
              alt="Generated Thumbnail"
              width={420}
              height={280}
              className="rounded-2xl border shadow-lg w-full max-w-md aspect-video object-cover"
            />
          </div>
        ) : error ? (
          <div className="mt-6 text-red-500 text-center">
            {error} — <button onClick={onSubmit} className="underline">Retry</button>
          </div>
        ) : null}
      </div>

      {/* Input */}
      <div className="flex gap-5 items-center p-3 border rounded-xl mt-10 bg-secondary">
        <textarea
          placeholder="Enter your YouTube video title or description"
          className="w-full outline-none bg-transparent"
          onChange={(event) => setUserInput(event.target.value)}
        />
        <div
          className="p-3 bg-gradient-to-t from-red-500 to-orange-500 rounded-full cursor-pointer"
          onClick={onSubmit}
        >
          <ArrowUp />
        </div>
      </div>

      {/* File Inputs */}
      <div className="mt-3 flex gap-3">
        {/* Reference Image */}
        <label htmlFor="referenceImage" className="w-full">
          {!referenceImagePreview ? (
            <div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition-all cursor-pointer">
              <ImagePlus />
              <h2>Reference Image</h2>
            </div>
          ) : (
            <div className="relative">
              <X
                className="absolute cursor-pointer"
                onClick={() => setReferenceImagePreview(undefined)}
              />
              <Image
                src={referenceImagePreview}
                alt="Reference Image"
                width={100}
                height={100}
                className="w-[70px] h-[70px] object-cover rounded-sm"
              />
            </div>
          )}
        </label>
        <input
          type="file"
          id="referenceImage"
          className="hidden"
          onChange={(e) => onHandleFileChange('referenceImage', e)}
        />

        {/* Face Image */}
        <label htmlFor="includeFace" className="w-full">
          {!faceImagePreview ? (
            <div className="p-4 w-full border rounded-xl bg-secondary flex gap-2 items-center justify-center hover:scale-105 transition-all cursor-pointer">
              <User />
              <h2>Include Face</h2>
            </div>
          ) : (
            <div className="relative">
              <X
                className="absolute cursor-pointer"
                onClick={() => setFaceImagePreview(undefined)}
              />
              <Image
                src={faceImagePreview}
                alt="Face Image"
                width={100}
                height={100}
                className="w-[70px] h-[70px] object-cover rounded-sm"
              />
            </div>
          )}
        </label>
        <input
          type="file"
          id="includeFace"
          className="hidden"
          onChange={(e) => onHandleFileChange('faceImage', e)}
        />
      </div>

      <ThumbnailList />
    </div>
  );
};

export default AiThumbnailGenerator;
