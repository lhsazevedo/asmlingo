import styles from "./page.module.css";
import db from "@/lib/db";
import { LessonList } from "@/components/LessonList";
import { Button } from "@/components/Button";
import { redirect } from "next/navigation";
import clsx from "clsx";
import { container } from "@/container";

export default async function Page() {
  const session = await container.resolve("session");

  const units = await db.unit.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          lessonProgress: session.get("userId")
            ? {
                where: {
                  userId: session.get("userId"),
                },
                take: 1,
              }
            : false,
        },
      },
      unitProgress: session.get("userId")
        ? {
            where: {
              userId: session.get("userId"),
            },
            take: 1,
          }
        : false,
    },
  });

  async function signout() {
    "use server";

    const session = await container.resolve("session");
    if (session) {
      session.destroy();
    }

    redirect("/");
  }

  const loggedIn = session && session.get("isGuest") === false;

  const userRepo = await container.resolve("userRepository");

  let user;
  if (session.get("userId")) {
    user = await userRepo.find(session.get("userId"));
  }

  return (
    <main className={clsx("px-2", styles.main)}>
      <pre>User: {JSON.stringify(user, null, 2)}</pre>
      <pre>Session: {JSON.stringify(session.all(), null, 2)}</pre>
      <div className="text-lg space-x-4 flex items-center justify-center mb-8">
        {loggedIn ? (
          <>
            {/* <div>{user?.name ? `Hi, ${user.name}!` : "Hi!"}</div> */}
            <form action={signout}>
              <Button variant="text" type="submit">
                Sign out
              </Button>
            </form>
          </>
        ) : (
          <Button variant="text" className="mb-8" href={`/signup`}>
            Sign up to save your progress!
          </Button>
        )}
      </div>
      <LessonList
        units={units}
        currentLessonId={user?.currentLessonId ?? undefined}
      />
    </main>
  );
}
