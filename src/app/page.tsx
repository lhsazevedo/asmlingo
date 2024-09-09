import Link from "next/link";
import styles from "./page.module.css";
import db from "@/lib/db";
import { getSession } from "@/lib/session";

export default async function Page() {
  const session = await getSession();

  const includeProgress = session?.userId ? {
    lessonProgress: {
      where: {
        userId: session.userId,
      },
      take: 1,
    },
  } : {};

  const units = await db.unit.findMany({
    orderBy: { order: "asc" },
    include: {
      lessons: {
        include: includeProgress,
      },
    },
  });

  return (
    <main className={styles.main}>
      <div>Id: { session.userId }</div>
      {/* {user.isGuest && <p><Link href="/signup">Sign up</Link> to save your progress.</p>} */}

      {units.map((unit) => (
        <div key={unit.id}>
          <div className="text-lg text-gray-400 font-bold mb-4">
            {unit.title}
          </div>
          {unit.lessons.map((lesson) => (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
              <div className="flex space-x-4 items-center">
                <div className="w-14 h-14 rounded-full bg-lime-500"></div>
                <h3 key={lesson.id} className="text-gray-700">
                  {lesson.title}
                  <pre>{JSON.stringify(lesson.lessonProgress, null, 2)}</pre>
                </h3>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </main>
  );
}
