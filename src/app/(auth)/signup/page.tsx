import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import argon2 from "argon2";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

const initialState = {
  name: "",
  email: "",
  password: "",
  errors: {},
};

export default async function Page() {
  async function signup(formData: FormData) {
    "use server";

    const rawFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validated = schema.safeParse(rawFormData);

    if (!validated.success) {
      return;
    }

    if (await db.user.findUnique({ where: { email: validated.data.email } })) {
      return;
    }

    const { session } = await getSession();
    if (session.isGuest === false) {
      redirect("/");
    }

    const hash = await argon2.hash(validated.data.password, {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
    });

    if (session.userId) {
      // Promote guest user to full user
      await db.user.update({
        where: { id: session.userId },
        data: {
          isGuest: false,
          email: validated.data.email,
          name: validated.data.name,
          password: hash,
        },
      });

      session.isGuest = false;
      session.save();
    } else {
      // Create new user
      const user = await db.user.create({
        data: {
          isGuest: false,
          email: validated.data.email,
          name: validated.data.name,
          password: hash,
        },
      });

      session.userId = user.id;
      session.isGuest = false;
      session.save();
    }

    revalidatePath("/");
    redirect("/");
  }

  const { session } = await getSession();
  if (session.isGuest === false) {
    redirect("/");
  }

  return (
    <form className="flex flex-col" action={signup}>
      <div className="text-lg text-red-500">This UI is work in progress</div>
      <label>
        Name (optional)
        <input type="text" name="name" />
      </label>
      <label>
        Email
        <input type="email" name="email" />
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
