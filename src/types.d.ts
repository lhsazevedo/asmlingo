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

export type ChallengeData = GapFillChallengeData;
