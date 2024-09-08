import { ChoiceListItem, ChoiceListItemState } from "../ChoiceListItem";
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
  }

  const isSelected = (index: number) => {
    return index === value;
  }

  function getChoiceState(index: number): ChoiceListItemState {
    const selected = isSelected(index);
    const correct = index === correctIndex;

    if (reveal && selected && correct) {
      return ChoiceListItemState.Correct;
    }

    return selected ? ChoiceListItemState.Selected : ChoiceListItemState.Normal;
  }

  return (
    <div
      className={clsx(styles.root, reveal && styles.reveal)}
      role="radiogroup"
    >
      {choices.map((choice, index) => (
        <ChoiceListItem
          role="radio"
          key={choice}
          state={getChoiceState(index)}
          onClick={() => handleClick(index)}
          aria-checked={isSelected(index)}
        >
          {choice}
        </ChoiceListItem>
      ))}
    </div>
  );
}
