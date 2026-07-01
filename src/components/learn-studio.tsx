"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, Flame, Award, Medal, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { educationCards } from "@/lib/content";
import { getRandomSample, type QuizQuestion } from "@/lib/quiz-bank";

type ResultsCopy = {
  title: string;
  body: string;
};

type BadgeTone = "success" | "primary" | "neutral" | "warn";

function badgeFromScore(score: number, total: number) {
  const ratio = total > 0 ? score / total : 0;

  if (ratio >= 0.9) {
    return { label: "Elite", tone: "success" as const };
  }

  if (ratio >= 0.7) {
    return { label: "Sharp", tone: "primary" as const };
  }

  if (ratio >= 0.5) {
    return { label: "Solid", tone: "neutral" as const };
  }

  return { label: "Rising", tone: "warn" as const };
}

function badgeClassName(tone: BadgeTone) {
  switch (tone) {
    case "success":
      return "bg-[var(--accent-light)] text-[var(--foreground)] border-[var(--border)]";
    case "primary":
      return "bg-[var(--accent-light)] text-[var(--foreground)] border-[var(--border)]";
    case "warn":
      return "bg-[#f6ece4] text-[#8d5f33] border-[#ecd6c4]";
    default:
      return "bg-white text-[var(--muted)] border-[var(--border)]";
  }
}

function resultsCopy(score: number, total: number): ResultsCopy {
  const ratio = total > 0 ? score / total : 0;

  if (ratio >= 0.9) {
    return {
      title: "Excellent.",
      body: "Your basics are solid. Keep going — you're ready for real-world sorting and reporting.",
    };
  }

  if (ratio >= 0.7) {
    return {
      title: "Strong work.",
      body: "You've got the fundamentals. A few more rounds and you'll be very consistent.",
    };
  }

  if (ratio >= 0.5) {
    return {
      title: "Good start.",
      body: "You're getting it. Review the explanations and try another set to sharpen the details.",
    };
  }

  return {
    title: "Keep practicing.",
    body: "No stress — take another set and focus on the explanations. You'll improve fast.",
  };
}

export function LearnStudio() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    getRandomSample(12),
  );
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);

  const current = questions[step];

  function answer(value: boolean) {
    if (!current || answered !== null) {
      return;
    }

    const isCorrect = value === current.answer;
    setAnswered(isCorrect);

    if (isCorrect) {
      setScore((previous) => previous + 1);
      setStreak((previous) => previous + 1);
    } else {
      setStreak(0);
    }
  }

  function moveNext() {
    setAnswered(null);
    setStep((previous) => Math.min(previous + 1, questions.length - 1));
  }

  function handleResults() {
    setShowResults(true);
    const ratio = questions.length > 0 ? score / questions.length : 0;
    if (ratio >= 0.7) {
      triggerConfetti();
    }
  }

  function triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#16a34a', '#0ea5e9', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#16a34a', '#0ea5e9', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }

  function resetQuiz() {
    setQuestions(getRandomSample(12));
    setStep(0);
    setScore(0);
    setStreak(0);
    setAnswered(null);
    setShowResults(false);
  }

  function reviewAgain() {
    setStep(0);
    setStreak(0);
    setAnswered(null);
    setShowResults(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface-panel p-5 sm:p-6">
        <div>
          <p className="eyebrow">Sorting Guide</p>
          <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] text-[var(--foreground)]">
            Quick disposal guidance
          </h2>
        </div>

        <div className="mt-6 grid gap-4">
          {educationCards.map((item) => (
            <div
              key={item.material}
              className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--accent-surface)] p-4 transition-all duration-200 hover:shadow-md"
            >
              <h3 className="font-semibold text-[var(--foreground)]">{item.material}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                {item.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-panel p-5 sm:p-6 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Quick check</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] text-[var(--foreground)]">
              Test yourself in 60 seconds
            </h2>
          </div>
          <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs text-[var(--foreground)] self-start sm:self-center font-bold">
            Score {score}
          </span>
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-[var(--border)] bg-[linear-gradient(180deg,var(--accent-surface),#f0f6ee)] p-5 relative overflow-hidden flex-1 flex flex-col">
          {/* Progress bar */}
          {!showResults && (
            <div className="absolute top-0 left-0 h-1.5 bg-[var(--border-light)] w-full">
              <motion.div 
                className="h-full bg-[var(--accent)]" 
                initial={{ width: 0 }}
                animate={{ width: `${(step / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          {showResults ? (
            <div className="space-y-4 animate-fade-in-up mt-2">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                Results
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-[2rem] tracking-[-0.05em] text-[var(--foreground)] flex items-center gap-3">
                  {badgeFromScore(score, questions.length).tone === "success" && <Award className="w-8 h-8 text-[var(--accent)]" />}
                  {badgeFromScore(score, questions.length).tone === "primary" && <Medal className="w-8 h-8 text-blue-500" />}
                  {badgeFromScore(score, questions.length).tone === "neutral" && <ThumbsUp className="w-8 h-8 text-slate-500" />}
                  {resultsCopy(score, questions.length).title}
                </h3>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${badgeClassName(
                    badgeFromScore(score, questions.length).tone,
                  )}`}
                >
                  {badgeFromScore(score, questions.length).label}
                </span>
              </div>
              <p className="text-sm leading-7 text-[var(--muted)]">
                You scored{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  {score}/{questions.length}
                </span>
                . {resultsCopy(score, questions.length).body}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row mt-4">
                <button
                  type="button"
                  onClick={resetQuiz}
                  className="btn-primary"
                >
                  New set
                </button>
                <button
                  type="button"
                  onClick={reviewAgain}
                  className="btn-outline"
                >
                  Review again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header with streak */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)] font-medium">
                  Question {step + 1} of {questions.length}
                </p>
                <div className="flex items-center gap-3">
                  <AnimatePresence>
                    {streak >= 3 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold"
                      >
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        {streak} Streak!
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="btn-outline rounded-full px-4 py-2 text-xs tracking-[0.12em]"
                  >
                    Shuffle
                  </button>
                </div>
              </div>

              {/* AnimatePresence for Question block */}
              <div className="relative flex-1 mt-4 flex flex-col min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col flex-1"
                  >
                    <p className="text-xl leading-8 text-[var(--foreground)] font-medium">
                      {current?.question ?? "No questions available yet."}
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => answer(true)}
                        disabled={answered !== null || !current}
                        className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all duration-200 
                          ${answered !== null 
                            ? (answered && current.answer === true) || (!answered && current.answer === true)
                              ? "border-[var(--accent)] bg-[var(--accent-light)] shadow-sm"
                              : "border-[var(--border)] bg-white opacity-40"
                            : "border-[var(--border)] bg-white hover:border-[var(--accent)] hover:shadow-md cursor-pointer"
                          }`}
                      >
                        <CheckCircle2 className={`w-8 h-8 ${answered !== null && current.answer === true ? "text-[var(--accent)]" : "text-[var(--muted-light)] group-hover:text-[var(--accent)]"}`} />
                        <span className="font-semibold text-[var(--foreground)]">True</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => answer(false)}
                        disabled={answered !== null || !current}
                        className={`group relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all duration-200 
                          ${answered !== null 
                            ? (answered && current.answer === false) || (!answered && current.answer === false)
                              ? "border-[var(--accent)] bg-[var(--accent-light)] shadow-sm"
                              : "border-[var(--border)] bg-white opacity-40"
                            : "border-[var(--border)] bg-white hover:border-[var(--accent)] hover:shadow-md cursor-pointer"
                          }`}
                      >
                        <XCircle className={`w-8 h-8 ${answered !== null && current.answer === false ? "text-[var(--accent)]" : "text-[var(--muted-light)] group-hover:text-[var(--accent)]"}`} />
                        <span className="font-semibold text-[var(--foreground)]">False</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {answered !== null && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={`mt-6 rounded-[1.4rem] px-5 py-4 text-sm shadow-sm ${
                            answered
                              ? "bg-[var(--accent-light)] text-[var(--foreground)] animate-pop border border-[var(--accent)]/20"
                              : "bg-[#f6ece4] text-[#8d5f33] animate-shake border border-[#8d5f33]/20"
                          }`}
                        >
                          <div className="font-semibold mb-1 flex items-center gap-2 text-base">
                            {answered ? <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" /> : <XCircle className="w-5 h-5 text-red-500" />}
                            {answered ? "Correct!" : "Not quite."}
                          </div>
                          <p className="leading-relaxed opacity-90 text-[var(--muted)]">{current.explanation}</p>
                          
                          <div className="mt-4 flex justify-end">
                            {step >= questions.length - 1 ? (
                              <button
                                type="button"
                                onClick={handleResults}
                                className="btn-primary py-2 px-6"
                              >
                                See results
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={moveNext}
                                className="btn-primary py-2 px-6"
                              >
                                Next question
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
