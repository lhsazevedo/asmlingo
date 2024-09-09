import { ChallengeData } from "@/types";
import { useState } from "react";
import { LessonMode } from "./LessonController";

export function useChallengeController(challenges: ChallengeData[]) {
  const [currentIndex, setcurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [lessonMode, setLessonMode] = useState<LessonMode>("normal");
  const [missedIndexes, setMissedIndexes] = useState<number[]>([]);
  const [missedTryCount, setMissedTryCount] = useState(0);

  let currentChallenge = challenges[currentIndex];
  if (lessonMode === "review") {
    currentChallenge = challenges[missedIndexes[currentIndex]];
  }

  const handleVerify = () => {
    if (revealed || value === undefined) return;

    setRevealed(true);

    const isCorrect = value === currentChallenge.correctIndex;

    if (!isCorrect && lessonMode === "normal") {
      setMissedIndexes([...missedIndexes, currentIndex]);
    }

    return isCorrect;
  };

  const resetChallengeState = () => {
    setValue(undefined);
    setRevealed(false);
  };

  const handleNext = (): boolean => {
    if (lessonMode === "review") {
      if (value !== currentChallenge.correctIndex) {
        setMissedTryCount(missedTryCount + 1);
        resetChallengeState();
        return false;
      }

      if (currentIndex >= missedIndexes.length - 1) {
        // alert("All challenges completed!");
        return true;
      }
    } else if (currentIndex >= challenges.length - 1) {
      if (missedIndexes.length) {
        setLessonMode("review");
        setcurrentIndex(0);
        resetChallengeState();
        return false;
      }

      // alert("All challenges completed!");
      return true;
    }

    setcurrentIndex(currentIndex + 1);
    resetChallengeState();
    return false;
  };

  const key: string = `${lessonMode}-${currentIndex}-${missedTryCount}`;

  return {
    currentChallenge,
    revealed,
    value,
    setValue,
    lessonMode,
    handleVerify,
    handleNext,
    key,
  }
}
