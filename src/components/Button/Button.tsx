"use client";

import React, { ReactNode } from "react";
import styles from "./Button.module.css";
import clsx from "clsx";
import Link from "next/link";

export enum ButtonState {
  Normal = "normal",
  Selected = "selected",
  Correct = "correct",
  Wrong = "wrong",
}

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "action"
  | "error"
  | "text";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  block?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
}

export function Button({
  variant = "primary",
  block = false,
  className,
  children,
  onClick,
  href,
}: Readonly<ButtonProps>) {
  if (href) {
    return (
      <Link
        href={href}
        className={clsx(
          styles.root,
          styles[variant],
          block && styles.block,
          className,
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={clsx(
        styles.root,
        styles[variant],
        block && styles.block,
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
