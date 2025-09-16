"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const aboutPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-blue-50 to-teal-100 px-6 py-12">
      {/* Heading */}
      <motion.h1
        className="text-2xl md:text-6xl font-extrabold font-mono bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent drop-shadow-lg leading-tight pb-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        About LungLens
      </motion.h1>

      {/* Card Section */}
      <motion.div
        className="max-w-3xl bg-white shadow-xl rounded-2xl p-8 md:p-12 text-xs text-center border border-gray-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          <span className="font-semibold text-teal-600">LungLens</span> is an
          intelligent platform designed to assist in the early detection of lung
          cancer. Unlike traditional methods, LungLens leverages advanced{" "}
          <span className="font-semibold text-green-600">
            deep learning models
          </span>{" "}
          to analyze CT scan images of the chest, helping identify potential
          signs of cancer with greater efficiency and accessibility.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The goal of this project is to{" "}
          <span className="font-semibold text-blue-600">
            simplify the process of lung cancer detection
          </span>
          , making it easier for healthcare professionals and patients to obtain
          reliable insights quickly.
        </p>

        <motion.button
          className="px-6 py-2 font-sans font-semibold bg-blue-600 text-xl text-white shadow-2xl rounded-full"
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <button onClick={() => router.push("/predict")}>Start Now</button>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default aboutPage;
