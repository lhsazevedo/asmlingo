export interface PromptToken {
  value: string;
  type: "operation" | "register" | "memory";
  hint: string;
}

export interface GapFillChallengeData {
  type: "gap-fill";
  translation: string;
  prompt: PromptToken[];
  choices: string[];
  fillableIndex: number;
  correctIndex: number;
}

export interface TranslateChallengeData {
  type: "translate";
  translation: string;
  prompt: PromptToken[];
  words: string[];
  correctIndexes: number[];
}

export type ChallengeData = GapFillChallengeData | TranslateChallengeData;
