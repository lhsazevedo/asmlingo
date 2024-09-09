import React, { ReactNode } from "react";
import styles from "./Button.module.css";
import clsx from "clsx";

export enum ButtonState {
  Normal = "normal",
  Selected = "selected",
  Correct = "correct",
  Wrong = "wrong",
}

export type ButtonVariant = "primary" | "secondary" | "text";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  variant = "primary",
  children,
  className,
  onClick,
  ...others
}: Readonly<ButtonProps>) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <button
      className={clsx(styles.root, styles[variant], className)}
      onClick={onClick}
      {...others}
    >
      {children}
    </button>
  );
}
