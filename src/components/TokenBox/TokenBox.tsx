import clsx from "clsx";
import styles from "./TokenBox.module.css";
import { PromptToken } from "@/types";

interface TokenBoxProps {
  tokens: PromptToken[];
  fillableIndex?: number;
  filledPrompt?: string;
  className?: string;
}

export function TokenBox({
  tokens,
  fillableIndex,
  filledPrompt,
  className,
}: Readonly<TokenBoxProps>) {
  return (
    <div className={clsx(styles.root, className)}>
      {tokens.map((token, index) => {
        const fillable = index === fillableIndex;

        let text = token.value;
        if (filledPrompt && fillable) {
          text = filledPrompt;
        }

        return (
          <div
            key={index}
            className={clsx(
              styles.token,
              token.hint && styles.hinted,
              fillable && styles.fillable,
              fillable && filledPrompt && styles.filled,
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
