"use client";

import { Button } from "@/components/Button";
import { PublicUser } from "@/app/api/auth/me/route";
import { useAuth } from "@/app/AuthProvider";

export function HomeHeader({ user }: { user?: PublicUser | null }) {
  const { logout } = useAuth();

  const loggedIn = user && user.isGuest === false;

  const handleSignOut = async () => {
    await logout();
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
