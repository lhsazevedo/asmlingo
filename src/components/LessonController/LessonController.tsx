import { ChallengeData } from "@/types";
import styles from "./LessonController.module.css";
import { useRef, useState } from "react";
import { GapFillChallenge } from "../GapFillChallenge";
import { motion, AnimatePresence, easeOut } from "framer-motion";

export interface LessonControllerProps {
  challenges: ChallengeData[];
}

interface ChallengeComponentProps {
  challengeData: ChallengeData;
  revealed: boolean;
  value: number | undefined;
  onChange: (value: number) => void;
}

const challengeComponents: Record<string, React.ComponentType<ChallengeComponentProps>> = {
  "gap-fill": GapFillChallenge,
}

export function LessonController({
  challenges,
}: Readonly<LessonControllerProps>) {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [value, setValue] = useState<number | undefined>(undefined);

  const currentChallenge = challenges[currentChallengeIndex];

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleVerify = () => {
    if (revealed) return;
    if (value === undefined) return;

    setRevealed(true);

    value === currentChallenge.correctIndex
      ? correctAudioRef.current?.play()
      : wrongAudioRef.current?.play();
  }

  const handleNext = () => {
    if (currentChallengeIndex === challenges.length - 1) {
      alert("All challenges completed!");
      return;
    }

    setCurrentChallengeIndex(currentChallengeIndex + 1);
    setValue(undefined);
    setRevealed(false);
  }

  const ChallengeComponent = challengeComponents[currentChallenge.type];
  if (!ChallengeComponent) {
    throw new Error(`Unknown challenge type: ${currentChallenge.type}`);
  }

  return (
    <div className={styles.root}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentChallengeIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.15, ease: easeOut }}
        >
          <ChallengeComponent
            challengeData={currentChallenge}
            revealed={revealed}
            value={value}
            onChange={setValue}
          />
        </motion.div>
      </AnimatePresence>
      {revealed ? (
        <button
          onClick={handleNext}
        >
          Next
        </button>
      ) : (
        <button onClick={handleVerify}>Verify</button>
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
