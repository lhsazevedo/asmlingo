import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SignUpForm from "./SignUpForm";

export default async function Page() {
  const { session } = await getSession();
  if (session.isGuest === false) {
    redirect("/");
  }

  return <SignUpForm />;
}
