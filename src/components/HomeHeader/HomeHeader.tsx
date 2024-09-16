"use client";

import { Button } from "@/components/Button";
import { User } from "@prisma/client";
import { SessionData } from "@/lib/session";
import { useRouter } from "next/navigation";

export function HomeHeader({
  user,
  session,
}: {
  user?: User | null;
  session: SessionData;
}) {
  const router = useRouter();

  const loggedIn = session && session.isGuest === false;

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <div className="text-lg space-x-4 flex items-center justify-center mb-8">
        {loggedIn ? (
          <>
            {<div>{user?.name ? `Hi, ${user.name}!` : "Hi!"}</div>}
            <Button variant="text" onClick={() => void handleSignOut()}>
              Sign out
            </Button>
          </>
        ) : (
          <Button variant="text" className="mb-8" href={`/signup`}>
            Sign up to save your progress!
          </Button>
        )}
      </div>
    </>
  );
}
