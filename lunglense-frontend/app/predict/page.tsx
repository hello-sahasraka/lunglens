"use client";
import React, { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { imageSchema } from "./schema";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { log } from "console";
import { fi } from "zod/locales";

const uploadImagePage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [previewURL, setPreviewURL] = React.useState<string>("");
  const [respondReceived, setRrespondReceived] = React.useState(false);
  const [respondedData, setRespondedData] = React.useState<any>("");

  useEffect(() => {
    if (!selectedFile) {
      setPreviewURL("");
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewURL(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    const result = imageSchema.safeParse(selectedFile);

    if (!result.success) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.error(result.error.issues[0].message);
      return;
    }

    setSelectedFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile as Blob);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Image uploaded successfully");
        setRespondedData(data);
        setRrespondReceived(true);

      } else {
        toast.error(data.message || "Image upload failed");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeAgain = () => {
    setRrespondReceived(false);
    setSelectedFile(null);
    setRespondedData("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadReport = async () => {
    const formData = new FormData();
    formData.append("predicted_class", respondedData.predicted_class.toString());
    formData.append("confidence", respondedData.confidence.toString());
    console.log(respondedData.all_probabilities);
    formData.append("predictions", JSON.stringify(respondedData.all_probabilities || []));
    formData.append("ct_scan", selectedFile as Blob);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict/pdf`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.pdf";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to generate report");
      }
    } catch (error) {
      toast.error("An error occurred while generating the report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-blue-50 to-teal-100 px-6 py-12"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1
        className="text-4xl md:text-4xl font-extrabold font-mono bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 
      bg-clip-text text-transparent drop-shadow-lg leading-tight pb-8"
      >
        Upload Image
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
        Upload your images effortlessly and unlock instant, precise analysis
        <br />
        powered by advanced AI. Experience fast, reliable, and actionable
        insights at your fingertips.
      </p>
      <img
        src={previewURL || "/empty_image.png"}
        className="w-[250px] aspect-square rounded-2xl mb-6 shadow-lg"
        alt="Empty"
      />

      {respondReceived ? (
        <motion.div
          className="w-[550px] flex flex-col justify-center items-center space-y-4 bg-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}>
          <h2 className="text-xl font-semibold">
            {respondedData.predicted_class === "Normal" && (
              <span className="text-green-700 text-lg px-4 py-2 bg-green-200 border border-green-300 rounded-lg">
                No Cancer Detected
              </span>
            )}
            {respondedData.predicted_class === "Adenocarcinoma" && (
              <span className="text-yellow-700 text-lg px-4 py-2 bg-yellow-200 border border-yellow-300 rounded-lg">
                Adenocarcinoma Detected
              </span>
            )}
            {respondedData.predicted_class === "Large Cell" && (
              <span className="text-red-700 text-lg px-4 py-2 bg-red-200 border border-red-300 rounded-lg">
                Large Cell Carcinoma Detected
              </span>
            )}
            {respondedData.predicted_class === "Squamous Cell" && (
              <span className="text-blue-700 text-lg px-4 py-2 bg-blue-200 border border-blue-300 rounded-lg">
                Squamous Cell Carcinoma Detected
              </span>
            )}
          </h2>
          <p className="text-md text-gray-600 font-medium h-[50px] w-auto px-4 py-2 text-center">
            The model is{" "}
            <span className="font-semibold text-blue-600">
              {(respondedData.confidence * 100).toFixed(2)}%
            </span>{" "}
            confident in this prediction.
          </p>
          <div className="gap-4 flex">
            <button
              className="btn btn-accent rounded w-[160px]"
              onClick={handleDownloadReport}
            >
              {isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                "Download Report"
              )}
            </button>
            <button
              className="btn btn-warning rounded w-[160px]"
              onClick={handleAnalyzeAgain}
            >
              Analyze Again
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="w-[550px] flex flex-col justify-center items-center space-y-4 bg-white p-8 rounded-lg shadow-lg">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <span className="loading loading-ring loading-xl scale-120"></span>
              <p className="text-gray-500 mt-4">Analyzing</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <input
                name="file"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="file-input file-input-success"
              />
              <motion.button
                className="btn btn-success rounded-3xl"
                onClick={handleSubmit}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "tween", stiffness: 300 }}
              >
                <ArrowUpRight size={18} /> Start Analyzing
              </motion.button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default uploadImagePage;
