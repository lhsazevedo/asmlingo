import { HashContract } from "../contracts/HashContract";
import argon2 from "argon2";

export default class Argon2HashProvider implements HashContract {
  async make(password: string): Promise<string> {
    // See OWASP Password Storage Cheat Sheet
    // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
    });
  }

  async check(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}
