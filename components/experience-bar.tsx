"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "./ui/progress";

export default function ExperienceBar() {
  const [progress, setProgress] = useState(65); // Fake progress percentage
  const [animations, setAnimations] = useState<{ id: number; x: number }[]>([]);

  // Fixed values for level 21
  const level = 21;
  const current = 42500;
  const required = 65000;

  useEffect(() => {
    const handleTap = (e: MouseEvent) => {
      // Increment progress by a small random amount on click
      setProgress((prev) => Math.min(100, prev + Math.random() * 2));

      const container = document.getElementById("xp-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
        triggerAnimation(xPercent);
      } else {
        triggerAnimation(50);
      }
    };

    document.addEventListener("click", handleTap);
    return () => document.removeEventListener("click", handleTap);
  }, []);

  function triggerAnimation(xPercent: number) {
    const newAnim = { id: Date.now(), x: xPercent };
    setAnimations((prev) => [...prev, newAnim]);
    setTimeout(() => {
      setAnimations((prev) => prev.filter((anim) => anim.id !== newAnim.id));
    }, 1000);
  }

  return (
    <div id="xp-container" className="relative my-2">
      {animations.map((anim) => (
        <div
          key={anim.id}
          className="absolute bottom-full"
          style={{
            left: `${anim.x}%`,
            animation: "floatUp 1s ease-out forwards",
          }}
        >
          <span className="text-lg font-bold text-yellow-400">+1</span>
        </div>
      ))}
      <div className="border-0">
        <div className="p-0">
          <div className="flex justify-between items-center text-white mb-2">
            <span className="font-semibold">Niveau {level}</span>
            <span className="tabular-nums">
              {current.toLocaleString()}/{required.toLocaleString()} XP
            </span>
          </div>
          <Progress value={progress} className="h-3 w-full" />
        </div>
      </div>
      <style jsx>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
