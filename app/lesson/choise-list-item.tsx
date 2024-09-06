import React, { ReactNode } from 'react'
import styles from './choise-list-item.module.css'
import clsx from 'clsx'

export enum ChoiceListItemState {
  Normal = "normal",
  Selected = "selected",
  Correct = "correct",
  Wrong = "wrong",
}

export interface ChoiceListItemProps {
  state: ChoiceListItemState,
  children: ReactNode,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
}

export function ChoiceListItem({ children, state, onClick, ...others }: Readonly<ChoiceListItemProps>) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <button
      className={clsx(styles.root, styles[state])}
      onClick={onClick}
      {...others}
    >
      {children}
    </button>
  )
}
