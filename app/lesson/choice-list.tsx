import { useState } from 'react';
import { ChoiceButton, ChoiceButtonState } from './choice-button'
import styles from "./choice-list.module.css";

export interface ChoiceListProps {
  choices: string[],
  correctIndex: number,
  reveal: boolean,
}

export function ChoiceList({ choices, correctIndex, reveal }: ChoiceListProps) {
  const [value, setValue] = useState<number | null>(null);

  return (
    <div className={styles.root}>
      {choices.map((choice, index) => (
        <ChoiceButton
          key={choice} state={index === (reveal && correctIndex) ? ChoiceButtonState.Correct : ChoiceButtonState.Normal}
        >
          {choice}
        </ChoiceButton>
      ))}
    </div>
  )
}
