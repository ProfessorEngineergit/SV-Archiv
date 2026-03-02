"use client";

import { useState, useEffect } from "react";
import { SVStunde, getSecondsUntilNext, formatDuration, isSessionInProgress } from "@/lib/schedule";

interface CountdownTimerProps {
  nextStunde: SVStunde | null;
}

export default function CountdownTimer({ nextStunde }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState<number>(() => getSecondsUntilNext(nextStunde));
  const [inProgress, setInProgress] = useState<boolean>(() => nextStunde ? isSessionInProgress(nextStunde) : false);

  useEffect(() => {
    if (!nextStunde) return;

    // Update every second
    const interval = setInterval(() => {
      setSeconds(getSecondsUntilNext(nextStunde));
      setInProgress(isSessionInProgress(nextStunde));
    }, 1000);

    return () => clearInterval(interval);
  }, [nextStunde]);

  if (!nextStunde || seconds <= 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 border border-stone-200 bg-white rounded-lg paper-card">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-stone-400 tracking-widest uppercase font-subtitle">
            {inProgress ? "Sitzung läuft" : "Nächste SV-Stunde"}
          </span>
        </div>
        
        <div className="text-center">
          <div className="text-4xl font-light text-stone-800 tabular-nums">
            {seconds.toLocaleString("de-DE")}
          </div>
          <div className="text-sm text-stone-500 mt-1">
            Sekunden
          </div>
          <div className="text-xs text-stone-400 mt-2">
            ({formatDuration(seconds)})
          </div>
        </div>

        <div className="text-xs text-stone-500 text-center mt-2">
          {nextStunde.dateString} • {nextStunde.fs}
        </div>
      </div>
    </div>
  );
}
