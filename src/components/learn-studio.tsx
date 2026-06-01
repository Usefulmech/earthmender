"use client";

import { useState } from "react";

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
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);

  const current = questions[step];

  function answer(value: boolean) {
    if (!current) {
      return;
    }

    const isCorrect = value === current.answer;
    setAnswered(isCorrect);

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }
  }

  function moveNext() {
    setAnswered(null);
    setStep((previous) => Math.min(previous + 1, questions.length - 1));
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

      <div className="surface-panel p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Quick check</p>
            <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] text-[var(--foreground)]">
              Test yourself in 60 seconds
            </h2>
          </div>
          <span className="rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs text-[var(--foreground)] self-start sm:self-center">
            Score {score}
          </span>
        </div>

        <div className="mt-6 rounded-[1.8rem] border border-[var(--border)] bg-[linear-gradient(180deg,var(--accent-surface),#f0f6ee)] p-5">
          {showResults ? (
            <div className="space-y-4 animate-fade-in-up">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                Results
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-[2rem] tracking-[-0.05em] text-[var(--foreground)]">
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
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setQuestions(getRandomSample(12));
                    setStep(0);
                    setScore(0);
                    setAnswered(null);
                    setShowResults(false);
                  }}
                  className="btn-primary"
                >
                  New set
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setAnswered(null);
                    setShowResults(false);
                  }}
                  className="btn-outline"
                >
                  Review again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-light)]">
                  Question {step + 1} of {questions.length}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuestions(getRandomSample(12));
                    setStep(0);
                    setScore(0);
                    setAnswered(null);
                    setShowResults(false);
                  }}
                  className="btn-outline rounded-full px-4 py-2 text-xs tracking-[0.12em]"
                >
                  Shuffle
                </button>
              </div>

              <p className="mt-4 text-lg leading-8 text-[var(--foreground)]">
                {current?.question ?? "No questions available yet."}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => answer(true)}
                  disabled={answered !== null || !current}
                  className="btn-primary disabled:opacity-50"
                >
                  True
                </button>
                <button
                  type="button"
                  onClick={() => answer(false)}
                  disabled={answered !== null || !current}
                  className="btn-outline disabled:opacity-50"
                >
                  False
                </button>
              </div>

              {answered !== null ? (
                <div className="mt-5 space-y-4 animate-fade-in-up">
                  <div
                    className={`rounded-[1.4rem] px-4 py-3 text-sm ${
                      answered
                        ? "bg-[var(--accent-light)] text-[var(--foreground)]"
                        : "bg-[#f6ece4] text-[#8d5f33]"
                    }`}
                  >
                    {answered ? "Correct." : "Not quite."} {current.explanation}
                  </div>

                  {step >= questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setShowResults(true)}
                      className="btn-primary"
                    >
                      See results
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={moveNext}
                      className="btn-primary"
                    >
                      Next question
                    </button>
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
