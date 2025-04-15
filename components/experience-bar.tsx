"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "./ui/progress";
import { Card, CardContent } from "./ui/card";

// Exponential XP curve: each level requires 50% more XP than the previous
function getXpForLevel(level: number): number {
  return Math.floor(1000 * Math.pow(1.5, level));
}

// Calculate level based on total XP
function getLevelFromXp(xp: number): number {
  let level = 0;
  let xpRequired = getXpForLevel(0);

  while (xp >= xpRequired) {
    xp -= xpRequired;
    level++;
    xpRequired = getXpForLevel(level);
  }

  return level;
}

// Get XP progress within current level
function getCurrentLevelXp(totalXp: number): {
  current: number;
  required: number;
} {
  const level = getLevelFromXp(totalXp);
  let xpInPreviousLevels = 0;

  for (let i = 0; i < level; i++) {
    xpInPreviousLevels += getXpForLevel(i);
  }

  return {
    current: totalXp - xpInPreviousLevels,
    required: getXpForLevel(level),
  };
}

export default function ExperienceBar() {
  const [serverXp, setServerXp] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [pending, setPending] = useState(0);
  const [displayedXp, setDisplayedXp] = useState(0);
  const [animations, setAnimations] = useState<{ id: number; x: number }[]>([]);
  const [lastPassiveXp, setLastPassiveXp] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const passive = Math.floor((now - lastUpdate) / 1000);
      if (passive > lastPassiveXp) {
        // Trigger animation for each new passive XP point
        for (let i = lastPassiveXp + 1; i <= passive; i++) {
          triggerAnimation(Math.random() * 100); // Random position along the bar
        }
        setLastPassiveXp(passive);
      }
      setDisplayedXp(serverXp + pending + passive);
    }, 100);
    return () => clearInterval(interval);
  }, [serverXp, pending, lastUpdate, lastPassiveXp]);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/progress", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setServerXp(data.xp);
          setLastUpdate(Date.now());
        }
      } catch (error) {
        console.error("Error fetching initial XP:", error);
      }
    }
    init();
  }, []);

  useEffect(() => {
    const flushInterval = setInterval(() => {
      if (pending > 0) {
        flushPending();
      }
    }, 5000);
    return () => clearInterval(flushInterval);
  }, [pending]);

  async function flushPending() {
    const increment = pending;
    setPending(0);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment }),
      });
      if (res.ok) {
        const data = await res.json();
        setServerXp(data.xp);
        setLastUpdate(Date.now());
      }
    } catch (error) {
      console.error("Error sending increments:", error);
    }
  }

  useEffect(() => {
    const handleTap = (e: MouseEvent) => {
      setPending((prev) => prev + 1);
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

  const level = getLevelFromXp(displayedXp);
  const { current, required } = getCurrentLevelXp(displayedXp);
  const progressPercent = (current / required) * 100;

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
          <Progress value={progressPercent} className="h-3 w-full" />
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
