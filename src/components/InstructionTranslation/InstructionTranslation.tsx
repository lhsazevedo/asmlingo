import clsx from "clsx";
import styles from "./InstructionTranslation.module.css";

export interface InstructionTranslationProps {
  children: React.ReactNode;
  className?: string;
}

export function InstructionTranslation({
  children,
  className,
}: InstructionTranslationProps) {
  return (
    <div className={clsx(styles.root, "text-lg", className)}>{children}</div>
  );
}
