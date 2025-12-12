"use client";

import { useEffect, useMemo, useState } from "react";
import RobotLoader from "../atoms/loader";

export default function AILoadingComponent() {
  const messages = useMemo(
    () => [
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
    ],
    [],
  );

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];

    if (charIndex < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 50); // Typing speed

      return () => clearTimeout(timeout);
    }
    // Wait before moving to next message
    const timeout = setTimeout(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      setDisplayedText("");
      setCharIndex(0);
    }, 1500); // Pause before next message

    return () => clearTimeout(timeout);
  }, [charIndex, currentMessageIndex, messages]);

  return (
    <div className="text-center p-8 max-w-md w-full mx-4">
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
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"
          style={{ width: "70%" }}
        ></div>
      </div>
    </div>
  );
}
