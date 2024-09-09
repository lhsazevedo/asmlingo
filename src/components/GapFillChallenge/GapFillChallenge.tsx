"use client";

import { ChoiceList } from "../ChoiceList";
import { PromptBox } from "../PromptBox";
import { InstructionTranslation } from "../InstructionTranslation";
import { GapFillChallengeData } from "@/types";

interface GapFillChallengeProps {
  challengeData: GapFillChallengeData;
  revealed: boolean;
  value?: number;
  onChange?: (value: number) => void;
}

export function GapFillChallenge({
  challengeData: { translation, prompt, fillableIndex, choices, correctIndex },
  revealed,
  value,
  onChange,
}: GapFillChallengeProps) {
  return (
    <div>
      <div className="text-2xl font-bold mb-4">Fill the gap:</div>
      <InstructionTranslation className="mb-4">
        {translation}
      </InstructionTranslation>
      <PromptBox
        className="mb-16"
        tokens={prompt}
        fillableIndex={fillableIndex}
        filledPrompt={value !== undefined ? choices[value] : value}
      />
      <ChoiceList
        choices={choices}
        correctIndex={correctIndex}
        reveal={revealed}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
