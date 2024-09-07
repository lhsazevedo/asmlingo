import { useRef, useState } from "react";
import { ChoiceList } from "../ChoiceList";
import { PromptBox, PromptToken } from "../PromptBox";
import { InstructionTranslation } from "../InstructionTranslation";

interface GapFillChallengeProps {
  translation: string;
  prompt: PromptToken[];
  choices: string[];
  fillableIndex: 0;
  correctIndex: 2;
}

export function GapFillChallenge({
  translation,
  prompt,
  fillableIndex,
  choices,
  correctIndex,
}: GapFillChallengeProps) {
  const [value, setValue] = useState<number | undefined>(undefined);
  const [revealed, setRevealed] = useState(false);

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  function handleVerify() {
    if (revealed) return;
    if (value === undefined) return;

    setRevealed(true);

    value === correctIndex
      ? correctAudioRef.current?.play()
      : wrongAudioRef.current?.play();
  }

  return (
    <div>
      <h2>Fill the gap:</h2>
      <InstructionTranslation>{translation}</InstructionTranslation>
      <PromptBox
        tokens={prompt}
        fillableIndex={fillableIndex}
        filledPrompt={value !== undefined ? choices[value] : value}
      />
      <ChoiceList
        choices={choices}
        correctIndex={correctIndex}
        reveal={revealed}
        value={value}
        onChange={setValue}
      />
      <button onClick={handleVerify}>Verify</button>
      <audio ref={correctAudioRef}>
        <source src="/correct.wav" type="audio/wav" />
      </audio>
      <audio ref={wrongAudioRef}>
        <source src="/wrong.wav" type="audio/wav" />
      </audio>
    </div>
  );
}
