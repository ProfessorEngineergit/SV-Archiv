"use client";

import { useState } from "react";
import { SVStunde } from "@/lib/schedule";

interface ThemenFormProps {
  nextStunde: SVStunde | null;
}

export default function ThemenForm({ nextStunde }: ThemenFormProps) {
  const [name, setName] = useState("");
  const [thema, setThema] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !thema.trim() || !nextStunde) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/themen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          thema: thema.trim(),
          nextStunde: {
            date: nextStunde.date.toISOString(),
            dateString: nextStunde.dateString,
            fs: nextStunde.fs,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch((e) => {
          console.warn("Failed to parse error response:", e);
          return {};
        });
        const message = errorData.error || "Fehler beim Einreichen des Themas";
        setErrorMessage(message);
        throw new Error(message);
      }
      
      setSubmitStatus("success");
      setName("");
      setThema("");
      
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Error submitting topic:", error);
      setSubmitStatus("error");
      if (!errorMessage && error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!nextStunde) {
    return (
      <div className="p-8 border border-slate-700/50 bg-slate-900/30 rounded-lg text-center">
        <div className="mb-4 text-4xl text-slate-700">
          <svg
            className="h-16 w-16 mx-auto text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-slate-500 text-sm">
          Keine bevorstehenden SV-Stunden geplant.
          <br />
          Die Themeneingabe wird verfügbar, sobald ein neuer Termin feststeht.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 border border-cyan-400/20 bg-slate-900/40 backdrop-blur-sm rounded-lg">
        {/* Name Field */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm text-slate-400 tracking-wider mb-2"
          >
            DEIN NAME <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Vorname Nachname"
            className="w-full border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-slate-200 placeholder-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-md"
            disabled={isSubmitting}
          />
        </div>

        {/* Theme Field */}
        <div>
          <label
            htmlFor="thema"
            className="block text-sm text-slate-400 tracking-wider mb-2"
          >
            THEMA / ANLIEGEN <span className="text-red-400">*</span>
          </label>
          <textarea
            id="thema"
            value={thema}
            onChange={(e) => setThema(e.target.value)}
            required
            placeholder="Beschreibe dein Thema oder Anliegen..."
            rows={6}
            className="w-full border border-slate-700/50 bg-slate-900/70 px-4 py-3 text-slate-200 placeholder-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition-all rounded-md resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !thema.trim()}
            className="w-full btn-glow px-6 py-3 bg-cyan-500/10 border border-cyan-400/30 rounded-lg text-cyan-300 font-medium tracking-wider transition-all hover:bg-cyan-500/20 hover:border-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-500/10 disabled:hover:border-cyan-400/30"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                WIRD EINGEREICHT...
              </span>
            ) : (
              "THEMA EINREICHEN"
            )}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-green-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-green-300">
                Thema erfolgreich eingereicht!
              </span>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <div className="flex-1">
                <span className="text-sm text-red-300 block">
                  {errorMessage || "Fehler beim Einreichen. Bitte versuche es erneut."}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
