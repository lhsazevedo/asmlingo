// Utility types
export type AtLeastOne<T> = Partial<T> &
  { [K in keyof T]: Pick<T, K> }[keyof T];
