import clsx from 'clsx';
import { TokenButton } from '../TokenButton';
import styles from './TranslationField.module.css';

export interface TranslationFieldProps {
  words: string[];
  readonly: boolean;
  onClick: (index: number) => void;
}

export function TranslationField({
  words,
  readonly = false,
  onClick,
}: Readonly<TranslationFieldProps>) {
  return (
    <div className={styles.root}>
      <div className={styles.lines}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      <div className={clsx(styles.words, readonly && styles.readonly)}>
        {words.map((word, index) => (
          <div key={index} className={styles.word}>
            <TokenButton onClick={() => onClick(index)}>{word}</TokenButton>
          </div>
        ))}
      </div>
    </div>
  );
};
