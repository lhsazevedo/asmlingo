"use client";

import { ChallengeData } from "@/types";
import styles from "./LessonController.module.css";
import { useRef } from "react";
import { GapFillChallenge } from "../GapFillChallenge";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import clsx from "clsx";
import { useChallengeController } from "./useChallengeController";
import RepeatIcon from "@/icons/RepeatIcon";
import { LessonControllerFooter } from "./LessonControllerFooter";
import { LessonControllerHeader } from "./LessonControllerHeader";
import { finish } from "@/app/lesson/[id]/actions";

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

export interface LessonControllerProps {
  lessonId: number;
  challenges: ChallengeData[];
}
export function LessonController({
  lessonId,
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
    missedIndexes,
    currentIndex,
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

  const onNext = async () => {
    const isCompleted = handleNext();
    if (isCompleted) {
      await finish({ lessonId });
    }
  };

  const realIndex =
    lessonMode === "review" ? challenges.length + currentIndex : currentIndex;

  return (
    <div className={clsx("flex-grow mb-32", styles.root)}>
      <LessonControllerHeader
        challengesCount={challenges.length + missedIndexes.length}
        currentChallengeIndex={realIndex}
      />
      <div className="my-4 w-full" style={{ maxWidth: "600px" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="w-full"
            key={key}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.15, ease: easeOut }}
          >
            {lessonMode === "review" && (
              <div
                className={clsx(
                  "flex items-center uppercase font-bold mb-4",
                  styles.previousMistake,
                )}
              >
                <RepeatIcon />
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

      <LessonControllerFooter
        revealed={revealed}
        isCorrect={isCorrect}
        value={value}
        onVerify={onVerify}
        onNext={onNext}
      />

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
