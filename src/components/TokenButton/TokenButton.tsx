import { ReactNode } from 'react';
import styles from './TokenButton.module.css';

export interface TokenButtonProps {
  children?: ReactNode
  onClick?: () => void
}

export function TokenButton({
  children,
  onClick,
}: Readonly<TokenButtonProps>) {
  return (
    <div
      className={styles.root}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
