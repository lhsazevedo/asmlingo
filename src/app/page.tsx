import styles from "./page.module.css";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { LessonList } from "@/components/LessonList";

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
            : {},
        },
      },
      unitProgress: session?.userId
        ? {
            where: {
              userId: session.userId,
            },
            take: 1,
          }
        : {},
    },
  });

  return (
    <main className={styles.main}>
      <div>Id: {session.userId}</div>
      <LessonList
        units={units}
        currentUnitId={user?.currentUnitId ?? undefined}
        currentLessonId={user?.currentLessonId ?? undefined}
      />
    </main>
  );
}
