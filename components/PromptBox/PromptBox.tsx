import clsx from "clsx";
import styles from "./PromptBox.module.css";

export interface PromptToken {
  value: string;
  type: "operation" | "register" | "memory";
  hint: string;
}

interface PromptBoxProps {
  tokens: PromptToken[];
  fillableIndex?: number;
  filledPrompt?: string;
}

export function PromptBox({
  tokens,
  fillableIndex,
  filledPrompt: selectedPrompt,
}: Readonly<PromptBoxProps>) {
  return (
    <div className={styles.root}>
      {tokens.map((token, index) => {
        const fillable = index === fillableIndex;

        let text = token.value;
        if (selectedPrompt && fillable) {
          text = selectedPrompt;
        }

        return (
          <div
            key={index}
            className={clsx(
              styles.token,
              token.hint && styles.hinted,
              fillable && styles.fillable,
              fillable && selectedPrompt && styles.filled,
            )}
            title={fillable ? undefined : token.hint}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
}
