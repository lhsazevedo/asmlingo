import { ChallengeData } from "@/types";
import styles from "./LessonController.module.css";
import { useRef } from "react";
import { GapFillChallenge } from "../GapFillChallenge";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import clsx from "clsx";
import { useChallengeController } from "./useChallengeController";

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
    key,
  } = useChallengeController(challenges);

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  const ChallengeComponent = challengeComponents[currentChallenge.type];
  if (!ChallengeComponent) {
    throw new Error(`Unknown challenge type: ${currentChallenge.type}`);
  }

  const onVerify = () => {
    const isCorrect = handleVerify();
    const audioRef = isCorrect ? correctAudioRef : wrongAudioRef;
    if (!audioRef.current?.paused) {
      audioRef.current?.pause();
    }
    audioRef.current?.play();
  }

  const onNext = () => {
    const isCompleted = handleNext();
    if (isCompleted) {
      alert("All challenges completed!");
    }
  }

  return (
    <div className={styles.root}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.15, ease: easeOut }}
        >
          {lessonMode === "review" && (
            <div className={clsx(styles.previousMistake)}>Previous mistake</div>
          )}
          <ChallengeComponent
            challengeData={currentChallenge}
            revealed={revealed}
            value={value}
            onChange={setValue}
          />
        </motion.div>
      </AnimatePresence>
      {revealed ? (
        <button onClick={onNext}>Next</button>
      ) : (
        <button onClick={onVerify}>Verify</button>
      )}

      <audio ref={correctAudioRef}>
        <source src="/correct.wav" type="audio/wav" />
      </audio>
      <audio ref={wrongAudioRef}>
        <source src="/wrong.wav" type="audio/wav" />
      </audio>
    </div>
  );
}
