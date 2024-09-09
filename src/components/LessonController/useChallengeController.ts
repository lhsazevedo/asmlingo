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
  const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);

  let currentChallenge = challenges[currentIndex];
  if (lessonMode === "review") {
    currentChallenge = challenges[missedIndexes[currentIndex]];
  }

  const handleVerify = () => {
    if (revealed || value === undefined) return;

    setRevealed(true);

    const correct = value === currentChallenge.correctIndex;
    setIsCorrect(correct);

    if (!correct && lessonMode === "normal") {
      setMissedIndexes([...missedIndexes, currentIndex]);
    }

    return correct;
  };

  const resetChallengeState = () => {
    setValue(undefined);
    setRevealed(false);
    setIsCorrect(undefined);
  };

  const handleNext = (): boolean => {
    if (lessonMode === "review") {
      if (value !== currentChallenge.correctIndex) {
        setMissedTryCount(missedTryCount + 1);
        resetChallengeState();
        return false;
      }

      if (currentIndex >= missedIndexes.length - 1) {
        return true;
      }
    } else if (currentIndex >= challenges.length - 1) {
      if (missedIndexes.length) {
        setLessonMode("review");
        setcurrentIndex(0);
        resetChallengeState();
        return false;
      }

      return true;
    }

    setcurrentIndex(currentIndex + 1);
    resetChallengeState();
    return false;
  };

  const key: string = `${lessonMode}-${currentIndex}-${missedTryCount}`;

  return {
    currentChallenge,
    currentIndex,
    revealed,
    value,
    setValue,
    lessonMode,
    missedIndexes,
    isCorrect,
    handleVerify,
    handleNext,
    key,
  };
}
