import { argon2id, hash } from "argon2";
import { AlreadyLoggedInError, EmailAlreadyTakenError } from "../auth/Errors";
import { SessionServiceContract } from "../contracts/SessionServiceContract";
// import { z } from "zod";
import { UserRepositoryContract } from "../contracts/UserRepositoryContract";

// const schema = z.object({
//   name: z
//     .string()
//     .min(2, "Name must be at least 2 characters long")
//     .max(50, "Name cannot exceed 50 characters"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters long"),
// });

export default function signUpActionFactory(
  session: SessionServiceContract,
  userRepo: UserRepositoryContract,
) {
  return async function ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    if (session.get("isGuest") === false) {
      throw new AlreadyLoggedInError();
    }

    // const validated = schema.safeParse(input);
    // if (!validated.success) {
    //   const errors: SignUpRouteErrors = {};
    //   const zodErrors = validated.error.flatten().fieldErrors;
    //   Object.entries(zodErrors).forEach(([field, messages]) => {
    //     if (field in errors) {
    //       return;
    //     }
    //     const message = messages?.[0];
    //     if (message) {
    //       errors[field as keyof SignUpRouteFields] = message;
    //     }
    //   });

    //   return NextResponse.json({ errors }, { status: 422 });
    // }

    if (await userRepo.findByEmail(email)) {
      throw new EmailAlreadyTakenError();
    }

    // See OWASP Password Storage Cheat Sheet
    // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
    // TODO: Extract hash service
    const hashed = await hash(password, {
      type: argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
    });

    let user;
    // Promote guest user to full user
    if (session.get("userId")) {
      user = await userRepo.update(session.get("userId"), {
        email,
        name,
        password: hashed,
        isGuest: false,
      });
    }
    // Create new user
    else {
      user = await userRepo.create({
        email: email,
        name: name,
        password: hashed,
        isGuest: false,
      });
    }

    session.set("userId", user.id);
    session.set("isGuest", false);
    await session.save();

    return user;
  };
}
