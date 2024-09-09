import { Button, ButtonState } from "../Button";
import styles from "./ChoiceList.module.css";
import clsx from "clsx";

export interface ChoiceListProps {
  choices: string[];
  correctIndex: number;
  reveal: boolean;
  value?: number;
  onChange?: (index: number) => void;
}

export function ChoiceList({
  choices,
  correctIndex,
  reveal,
  value,
  onChange,
}: Readonly<ChoiceListProps>) {
  const handleClick = (index: number) => {
    // TODO: Test this condition
    !reveal && onChange?.(index);
  };

  const isSelected = (index: number) => {
    return index === value;
  };

  function getChoiceState(index: number): ButtonState {
    const selected = isSelected(index);
    const correct = index === correctIndex;

    if (reveal && selected && correct) {
      return ButtonState.Correct;
    }

    return selected ? ButtonState.Selected : ButtonState.Normal;
  }

  function getChoiceClass(index: number) {
    const selected = isSelected(index);
    const correct = index === correctIndex;

    if (reveal && selected && correct) {
      return styles.correct;
    }

    return selected ? styles.selected : false;
  }

  return (
    <div
      className={clsx(styles.root, reveal && styles.reveal)}
      role="radiogroup"
    >
      {choices.map((choice, index) => (
        <Button
          role="radio"
          key={choice}
          variant="secondary"
          className={clsx(styles.choice, getChoiceClass(index))}
          // state={getChoiceState(index)}
          onClick={() => handleClick(index)}
          aria-checked={isSelected(index)}
        >
          {choice}
        </Button>
      ))}
    </div>
  );
}
