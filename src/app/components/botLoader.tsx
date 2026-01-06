"use client";

import { useCallback, useEffect, useState } from "react";
import RobotLoader from "../atoms/loader";

export default function AILoadingComponent() {
  const messages = [
    "Analyzing your data...",
    "Processing information with AI...",
    "Ranking information with AI...",
    "Identifying patterns and insights...",
    "Running advanced algorithms...",
    "Comparing products…",
    "Scanning the web for the best deals…",
    "Crunching numbers…",
    "Finding top-rated options…",
    "Optimizing search results…",
    "Checking product specifications…",
    "Gathering marketplace insights…",
    "Searching through millions of products…",
    "Almost there, preparing results…",
    "Loading smart comparisons…",
    "Analyzing your request…",
    "Generating intelligent responses...",
    "Validating results...",
    "Optimizing recommendations...",
    "Cross-referencing data points...",
    "Finalizing analysis...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Progressive delay mapping based on progress
  const getDelayForProgress = useCallback((prog: number) => {
    if (prog < 10) return 1500;
    if (prog < 20) return 2000;
    if (prog < 30) return 3000;
    if (prog < 40) return 4000;
    if (prog < 50) return 5000;
    if (prog < 60) return 6000;
    if (prog < 70) return 7000;
    if (prog < 80) return 8000;
    if (prog < 90) return 9000;
    return 10000;
  }, []);

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];

    if (charIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 50); // Typing speed

      return () => clearTimeout(timeout);
    } else {
      // Wait before moving to next message
      const delay = getDelayForProgress(progress);
      const timeout = setTimeout(() => {
        setCurrentMessageIndex((currentMessageIndex + 1) % messages.length);
        setDisplayedText("");
        setCharIndex(0);
        // Increment progress with diminishing returns
        setProgress((prev) => Math.min(95, prev + (100 - prev) * 0.15));
      }, delay); // Pause before next message

      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentMessageIndex, progress, getDelayForProgress]);

  return (
    <div className="text-center p-8   max-w-md w-full mx-4">
      {/* Animated spinner */}
      {/*<div className="mb-6 flex justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>*/}

      <RobotLoader />
      {/* Typewriter text */}
      <div className="mb-4 h-16 flex items-center justify-center">
        <p className="text-lg font-medium text-gray-700">
          {displayedText}
          <span className="inline-block w-0.5 h-5 bg-indigo-600 ml-1 animate-pulse"></span>
        </p>
      </div>

      {/* Progress indicator */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
