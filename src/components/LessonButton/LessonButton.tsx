import styles from "./LessonButton.module.css";
import clsx from "clsx";
import StarIcon from "@/icons/StarIcon";

export interface LessonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LessonButtonVariant;
  onClick?: () => void;
}

export type LessonButtonVariant = "default" | "current" | "disabled";

export function LessonButton({
  variant = "default",
  onClick,
  ...others
}: Readonly<LessonButtonProps>) {
  return (
    <div className={clsx(styles.root, styles[variant])}>
      <button disabled={variant === "disabled"} onClick={onClick} {...others}>
        <StarIcon size={32} />
      </button>
      {variant === "current" && (
        <svg
          className={styles.currentCircle}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="6" />
        </svg>
      )}
    </div>
  );
}
