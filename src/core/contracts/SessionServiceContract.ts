export interface SessionData {
  userId: number;
  isGuest: boolean;
}

export interface SessionServiceContract {
  all: () => SessionData;
  get: <K extends keyof SessionData>(key: K) => SessionData[K];
  set: <K extends keyof SessionData>(key: K, value: SessionData[K]) => void;
  save: () => Promise<void>;
  destroy: () => void;
}
