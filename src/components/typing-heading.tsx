"use client";

import { useEffect, useState } from "react";

export function TypingHeading() {
  const line1 = "Healing together.";
  const line2 = "Mending forever.";
  const [displayedLine1, setDisplayedLine1] = useState("");
  const [displayedLine2, setDisplayedLine2] = useState("");
  const [isTypingLine1, setIsTypingLine1] = useState(true);

  useEffect(() => {
    let currentLength = 0;
    setDisplayedLine1("");
    const timer = setInterval(() => {
      currentLength++;
      setDisplayedLine1(line1.substring(0, currentLength));
      if (currentLength === line1.length) {
        clearInterval(timer);
        setIsTypingLine1(false);
      }
    }, 150); 

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isTypingLine1) return;
    
    let currentLength = 0;
    setDisplayedLine2("");
    const timer = setInterval(() => {
      currentLength++;
      setDisplayedLine2(line2.substring(0, currentLength));
      if (currentLength === line2.length) {
        clearInterval(timer);
      }
    }, 150);

    return () => clearInterval(timer);
  }, [isTypingLine1]);

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
