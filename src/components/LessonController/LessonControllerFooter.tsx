import styles from "./LessonController.module.css";
import clsx from "clsx";
import { Button } from "../Button";

interface LessonControllerFooterProps {
  revealed: boolean;
  isCorrect: boolean | undefined;
  value: number | undefined;
  onVerify: () => void;
  onNext: () => void;
}

export function LessonControllerFooter({
  revealed,
  isCorrect,
  value,
  onVerify,
  onNext,
}: LessonControllerFooterProps) {
  return (
    <>
      {revealed ? (
        <div
          className={clsx(
            "-mx-4 px-4 -mb-6 py-6",
            styles.footer,
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
            Continue
          </Button>
        </div>
      ) : (
        <Button onClick={onVerify} block disabled={value === undefined}>
          Verify
        </Button>
      )}
    </>
  );
}
