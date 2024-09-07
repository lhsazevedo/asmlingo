import { useState } from "react";
import { ChoiceListItem, ChoiceListItemState } from "./choise-list-item";
import styles from "./choice-list.module.css";

export interface ChoiceListProps {
  choices: string[];
  correctIndex: number;
  reveal: boolean;
}

export function ChoiceList({
  choices,
  correctIndex,
  reveal,
}: Readonly<ChoiceListProps>) {
  const [value, setValue] = useState<number | null>(null);

  return (
    <div className={styles.root} role="radiogroup">
      {choices.map((choice, index) => (
        <ChoiceListItem
          key={choice}
          role="radio"
          state={
            index === (reveal && correctIndex)
              ? ChoiceListItemState.Correct
              : ChoiceListItemState.Normal
          }
          onClick={(e) => console.log(e)}
        >
          {choice}
        </ChoiceListItem>
      ))}
    </div>
  );
}
