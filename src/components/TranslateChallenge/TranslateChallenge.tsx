"use client";

import { ChoiceList } from "../ChoiceList";
import { TokenBox } from "../TokenBox";
import { InstructionTranslation } from "../InstructionTranslation";
import { TranslateChallengeData } from "@/types";

interface TranslateChallengeProps {
  challengeData: TranslateChallengeData;
  revealed: boolean;
  value?: number;
  onChange?: (value: number) => void;
}

export function TranslateChallenge({
  challengeData: { translation, prompt, words, correctIndexes },
  revealed,
  value,
  onChange,
}: TranslateChallengeProps) {
  return (
    <div>
      <div className="text-2xl font-bold mb-4">Write in english:</div>
      {/* <InstructionTranslation className="mb-4">
        {translation}
      </InstructionTranslation> */}
      <TokenBox
        className="mb-16"
        tokens={prompt}
        filledPrompt={value !== undefined ? choices[value] : value}
      />
      {/* <ChoiceList
        choices={choices}
        correctIndex={correctIndex}
        reveal={revealed}
        value={value}
        onChange={onChange}
      /> */}
    </div>
  );
}
