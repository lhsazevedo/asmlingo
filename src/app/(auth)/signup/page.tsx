"use server";

import { redirect } from "next/navigation";
import SignUpForm from "./SignUpForm";
import { container } from "@/container";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const session = await container.resolve("pendingSession");
  if (session.get("isGuest") === false) {
    revalidatePath("/");
    redirect("/");
  }

  return <SignUpForm />;
}
