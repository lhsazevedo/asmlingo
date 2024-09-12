"use client";

import { TokenBox } from "../TokenBox";
import { InstructionTranslation } from "../InstructionTranslation";
import { TranslateChallengeData } from "@/types";
import { TranslationArea } from "../TranslationArea";

interface TranslateChallengeProps {
  challengeData: TranslateChallengeData;
  revealed: boolean;
  value?: number;
  onChange?: (value: number) => void;
}

export function TranslateChallenge({
  challengeData: { prompt, words, correctIndexes },
  revealed,
  value,
  onChange,
}: TranslateChallengeProps) {
  return (
    <div>
      <div className="text-2xl font-bold mb-4">Write in english:</div>
      <TokenBox
        className="mb-16"
        tokens={prompt}
      />
      <TranslationArea words={words} readonly={revealed} />
    </div>
  );
}
