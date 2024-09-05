import { ReactNode } from 'react'
import styles from './choice-button.module.css'
import clsx from 'clsx'

export enum ChoiceButtonState {
  Normal = "normal",
  Selected = "selected",
  Correct = "correct",
  Wrong = "wrong",
}

export interface ChoiceButtonProps {
  state: ChoiceButtonState,
  children: ReactNode,
}

export function ChoiceButton({ children, state }: Readonly<ChoiceButtonProps>) {
    return (
      <div className={clsx(styles.root, styles[state])}>
        {children}
      </div>
    )
}
