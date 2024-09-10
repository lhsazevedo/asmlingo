import styles from "./page.module.css";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { LessonList } from "@/components/LessonList";
import { Button } from "@/components/Button";
import { redirect } from "next/navigation";
import clsx from "clsx";
// import { signout } from "./actions";

export default async function Page() {
  let { session, user } = await getSession();

  let units = await db.unit.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          lessonProgress: session?.userId
            ? {
                where: {
                  userId: session.userId,
                },
                take: 1,
              }
            : false,
        },
      },
      unitProgress: session?.userId
        ? {
            where: {
              userId: session.userId,
            },
            take: 1,
          }
        : false,
    },
  });

  async function signout() {
    "use server";

    const { session } = await getSession();

    if (session) {
      session.destroy();
    }

    redirect("/");
  }

  const loggedIn = session && session?.isGuest === false;

  return (
    <main className={clsx('px-2', styles.main)}>
      {/* <pre>User: {JSON.stringify(user, null, 2)}</pre>
      <pre>Session: {JSON.stringify(session, null, 2)}</pre> */}
      <div className="text-lg space-x-4 flex items-center justify-center mb-8">
        {loggedIn ? (
          <>
            <div>{user?.name ? `Hi, ${user.name}!` : "Hi!"}</div>
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
        currentUnitId={user?.currentUnitId ?? undefined}
        currentLessonId={user?.currentLessonId ?? undefined}
      />
    </main>
  );
}
