"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

const bounceVariants: Variants = {
  animate: (delay = 0) => ({
    y: [0, -20, 0],
    transition: {
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

export default function PromotionBanner() {
  return (
    <div className="relative overflow-hidden py-4 md:py-8 px-6 bg-red-600 rounded-3xl sm:mx-2 md:mx-4">
      {/* Ball 1: top-left */}
      <motion.div
        custom={0}
        variants={bounceVariants}
        animate="animate"
        className="absolute top-6 left-4 w-12 h-12 bg-yellow-300 rounded-full md:z-10"
      />

      {/* Ball 2: top-right */}
      <motion.div
        custom={0.5}
        variants={bounceVariants}
        animate="animate"
        className="absolute top-6 right-4 w-12 h-12 bg-yellow-300 rounded-full md:z-10"
      />

      {/* Ball 3: bottom-left */}
      <motion.div
        custom={1}
        variants={bounceVariants}
        animate="animate"
        className="absolute bottom-8 left-8 w-20 h-20 bg-green-400 rounded-full"
      />

      {/* Ball 4: bottom-right */}
      <motion.div
        custom={1.5}
        variants={bounceVariants}
        animate="animate"
        className="absolute bottom-8 right-8 w-20 h-20 bg-green-400 rounded-full"
      />

      {/* Ball 5: center-left */}
      <motion.div
        custom={2}
        variants={bounceVariants}
        animate="animate"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 w-14 h-14 bg-purple-400 rounded-full"
      />

      {/* Ball 6: center-right */}
      <motion.div
        custom={2.5}
        variants={bounceVariants}
        animate="animate"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 w-14 h-14 bg-purple-400 rounded-full"
      />

      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative">
        {/* Static text */}
        <div className="max-w-lg text-center md:text-left md:ml-16 md:pl-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 z-20">
            Discover Dress Express Products
          </h2>
          <p className="text-base md:text-lg text-gray-100 z-20">
            Limited stock available. Grab yours before they’re gone!
          </p>
        </div>

        {/* Button with gentle hover bounce */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 md:pr-8 md:mr-16"
        >
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-2 bg-white rounded-full text-red-600 font-semibold uppercase tracking-wide shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white transition"
          >
            Check Products
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
