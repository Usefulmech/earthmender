"use client";

import { useEffect, useState } from "react";

export function TypingHeading() {
  const line1 = "Healing together.";
  const line2 = "Mending forever.";
  const [displayedLine1, setDisplayedLine1] = useState("");
  const [displayedLine2, setDisplayedLine2] = useState("");
  const [isTypingLine1, setIsTypingLine1] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedLine1((prev) => prev + line1.charAt(index));
      index++;
      if (index === line1.length) {
        clearInterval(timer);
        setIsTypingLine1(false);
      }
    }, 70); 

    return () => clearInterval(timer);
  }, [line1]);

  useEffect(() => {
    if (isTypingLine1) return;
    
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedLine2((prev) => prev + line2.charAt(index));
      index++;
      if (index === line2.length) {
        clearInterval(timer);
      }
    }, 70);

    return () => clearInterval(timer);
  }, [isTypingLine1, line2]);

  return (
    <h1 className="font-display text-[4rem] font-bold leading-[1.05] tracking-tighter sm:text-[6.5rem]">
      {displayedLine1}
      {isTypingLine1 && <span className="animate-pulse border-r-[6px] border-[var(--foreground)] ml-2 h-[4rem] sm:h-[6rem] inline-block align-bottom" />}
      <br />
      <span className="text-[var(--muted)]">
        {displayedLine2}
        {!isTypingLine1 && <span className="animate-pulse border-r-[6px] border-[var(--muted)] ml-2 h-[4rem] sm:h-[6rem] inline-block align-bottom" />}
      </span>
    </h1>
  );
}
