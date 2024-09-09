"use client";

import { ChallengeData } from "@/types";
import styles from "./LessonController.module.css";
import { useRef, useState } from "react";
import { GapFillChallenge } from "../GapFillChallenge";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import clsx from "clsx";
import { useChallengeController } from "./useChallengeController";
import { Button } from "../Button";

export interface LessonControllerProps {
  challenges: ChallengeData[];
}

interface ChallengeComponentProps {
  challengeData: ChallengeData;
  revealed: boolean;
  value: number | undefined;
  onChange: (value: number) => void;
}

const challengeComponents: Record<
  string,
  React.ComponentType<ChallengeComponentProps>
> = {
  "gap-fill": GapFillChallenge,
};

export type LessonMode = "normal" | "review";

export function LessonController({
  challenges,
}: Readonly<LessonControllerProps>) {
  const {
    currentChallenge,
    revealed,
    value,
    setValue,
    lessonMode,
    handleVerify,
    handleNext,
    isCorrect,
    key,
  } = useChallengeController(challenges);

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  const ChallengeComponent = challengeComponents[currentChallenge.type];
  if (!ChallengeComponent) {
    throw new Error(`Unknown challenge type: ${currentChallenge.type}`);
  }

  const onVerify = () => {
    const result = handleVerify();
    const audioRef = result ? correctAudioRef : wrongAudioRef;
    if (!audioRef.current?.paused) {
      audioRef.current?.pause();
    }
    audioRef.current?.play();
  };

  const onNext = () => {
    const isCompleted = handleNext();
    if (isCompleted) {
      alert("All challenges completed!");
    }
  };

  return (
    <div className={clsx("px-4 py-6", styles.root)}>
      <div>Header</div>
      <div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={key}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.15, ease: easeOut }}
          >
            {lessonMode === "review" && (
              <div className={clsx('uppercase font-bold my-2', styles.previousMistake)}>
                Previous mistake
              </div>
            )}
            <ChallengeComponent
              challengeData={currentChallenge}
              revealed={revealed}
              value={value}
              onChange={setValue}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {revealed ? (
        <div
          className={clsx(
            "-mx-4 px-4 -mb-6 py-6",
            styles.revealCard,
            isCorrect ? styles.correct : styles.wrong,
          )}
        >
          <div className="text-2xl font-bold mb-4">
            {isCorrect ? "Amazing!" : "Oops!"}
          </div>
          <Button
            onClick={onNext}
            variant={revealed && !isCorrect ? "error" : "primary"}
            block
          >
            Next
          </Button>
        </div>
      ) : (
        <Button onClick={onVerify} block disabled={value === undefined}>
          Verify
        </Button>
      )}

      <audio ref={correctAudioRef} preload="auto">
        <source src="/correct.ogg" type="audio/ogg" />
        <source src="/correct.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={wrongAudioRef} preload="auto">
        <source src="/wrong.ogg" type="audio/ogg" />
        <source src="/wrong.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
