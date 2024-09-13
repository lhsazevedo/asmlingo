import { redirect } from "next/navigation";
import SignUpForm from "./SignUpForm";
import { container } from "@/container";

export default async function Page() {
  const session = await container.resolve("session");
  if (session.get("isGuest") === false) {
    redirect("/");
  }

  return <SignUpForm />;
}
