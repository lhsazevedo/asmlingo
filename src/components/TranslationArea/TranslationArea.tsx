import React from "react";
import { useState } from "react";
import { TranslationField } from "../TranslationField";
import { WordBank } from "../WordBank";
import styles from "./TranslationArea.module.css";

export interface TranslationAreaProps {
  /**
   * The word choices to display.
   */
  readonly words: string[];

  /**
   * Usefull for when the user has already submitted their answer.
   */
  readonly readonly: boolean;
}

export function TranslationArea({
  words,
  readonly = false,
}: TranslationAreaProps) {
  const [value, setValue] = useState<number[]>([]);

  const handleAdd = (newValue: number[]) => {
    setValue(newValue);
  };

  const handleRemove = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    setValue(newValue);
  };

  return (
    <div className={styles.root}>
      <TranslationField
        words={value.map((v) => words[v])}
        readonly={readonly}
        onClick={handleRemove}
      />
      <WordBank
        words={words}
        value={value}
        readonly={readonly}
        onChange={handleAdd}
      />
    </div>
  );
}
