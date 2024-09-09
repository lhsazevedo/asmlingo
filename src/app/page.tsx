import Link from "next/link";
import styles from "./page.module.css";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import clsx from "clsx";
import StarIcon from "@/icons/StarIcon";

export default async function Page() {
  const session = await getSession();

  const units = await db.unit.findMany({
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
      {/* {user.isGuest && <p><Link href="/signup">Sign up</Link> to save your progress.</p>} */}

      {units.map((unit, unitIndex) => (
        <div key={unit.id} className="mb-16">
          <div className="text-lg text-gray-400 font-bold text-center">
            {unit.title}
          </div>
          {unit.lessons.map((lesson, lessonIndex) => {
            const previousUnit = units[unitIndex - 1];
            const previousLesson = unit.lessons[lessonIndex - 1];
            const isCompleted =
              unit.unitProgress[0]?.finishedAt ||
              lesson.lessonProgress[0]?.finishedAt;
            const isAvailable =
              (lessonIndex === 0 &&
                (unitIndex === 0 ||
                  (previousUnit &&
                    previousUnit.unitProgress[0]?.finishedAt))) ||
              (previousLesson && previousLesson.lessonProgress[0]?.finishedAt);

            return (
              <div key={lesson.id} className="mt-4">
                {isAvailable ? (
                  <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                    <div className="flex space-x-4 items-center justify-center">
                      <div
                        className={clsx(
                          "w-14 h-14 rounded-full bg-lime-500 flex items-center justify-center text-white",
                        )}
                      >
                        <StarIcon size={32} />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex space-x-4 items-center justify-center">
                    <div
                      className={clsx(
                        "w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white",
                      )}
                    >
                      <StarIcon size={32} />
                    </div>
                  </div>
                )}
                <div className="text-center text-gray-600">{lesson.title}</div>
                {/* <pre>{JSON.stringify(lesson.lessonProgress, null, 2)}</pre> */}
              </div>
            );
          })}
        </div>
      ))}
    </main>
  );
}
