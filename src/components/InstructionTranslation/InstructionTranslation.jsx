import clsx from "clsx";
import styles from "./InstructionTranslation.module.css";

export function InstructionTranslation({ children, className }) {
  return (
    <div className={clsx(styles.root, "text-lg", className)}>{children}</div>
  );
}
