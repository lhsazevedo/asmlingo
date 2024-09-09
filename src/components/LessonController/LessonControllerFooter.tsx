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
    <div
      className={clsx(
        revealed && (isCorrect ? styles.correct : styles.wrong),
        styles.footer,
      )}
    >
      <div className={clsx("max-w-screen-md mx-auto px-4 py-6")}>
        {revealed ? (
          <>
            <div className="text-2xl font-bold mb-4">
              {isCorrect ? "Amazing!" : "Oops!"}
            </div>
            <div className="md:w-48 md:ml-auto">
              <Button
                onClick={onNext}
                variant={revealed && !isCorrect ? "error" : "primary"}
                block
              >
                Continue
              </Button>
            </div>
          </>
        ) : (
          <div className="md:w-48 md:ml-auto">
            <Button onClick={onVerify} block disabled={value === undefined}>
              Verify
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
