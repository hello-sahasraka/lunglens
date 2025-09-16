"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-blue-50 to-teal-100 relative overflow-hidden">
      {/* Breathing Logo Animation */}
      <motion.img
        src="/Lunglens_Logo.png"
        alt="logo"
        className="w-[180px] mb-6 drop-shadow-xl"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
      />

      {/* Title */}
      <motion.h1
        className="text-4xl md:text-7xl font-extrabold font-mono tracking-wide bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent drop-shadow-lg leading-tight pb-2"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      >
        LungLens
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="mt-4 text-md md:text-xl text-gray-700 font-mono"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Breathing innovation into healthcare
      </motion.p>

      {/* CTA Button */}
      <motion.button
        className="mt-8 px-4 py-3 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 shadow-lg hover:shadow-2xl"
        onClick={() => {router.push("/about")}}
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Continue →
      </motion.button>

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-green-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-blue-400 rounded-full blur-3xl opacity-20"></div>
    </div>
  );
}
