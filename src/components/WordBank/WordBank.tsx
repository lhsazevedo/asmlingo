import { useState } from "react";
import { Button } from "../Button";
import styles from "./WordBank.module.css";
import clsx from "clsx";
import { TokenButton } from "../TokenButton";

export interface WordBankProps {
  words: string[];
  value: number[];
  readonly?: boolean;
  onChange?: (value: number[]) => void;
}

export function WordBank({ words, value, readonly = false, onChange }: Readonly<WordBankProps>) {
  const handleWordClick = (index: number) => {
    onChange?.([...value, index]);
  };

  return (
    <div className={clsx(styles.root, readonly && styles.readonly)}>
      {words.map((word, index) =>
        !value.includes(index) ? (
          <TokenButton key={index} onClick={() => handleWordClick(index)}>
            {word}
          </TokenButton>
        ) : (
          <div key={index} className={styles.slot}>
            {word}
          </div>
        ),
      )}
    </div>
  );
}

// <Button
//   key={index}
//   variant="secondary"
//   className={styles.word}
//   onClick={() => handleWordClick(index)}
// >
//   {word}
// </Button>
