export interface HashContract {
  make(password: string): Promise<string>;
  check(password: string, hash: string): Promise<boolean>;
}
