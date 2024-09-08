import Link from "next/link";
import styles from "./page.module.css";
import db from "@/lib/db";
import { getSession } from "@/lib/session";

export default async function Page() {
  const { user } = await getSession();

  const units = await db.unit.findMany({
    orderBy: { order: "asc" },
    include: { lessons: true },
  });

  return (
    <main className={styles.main}>
      <h1>Hi {user.isGuest ? "Guest" : user.name}!</h1>
      {user.isGuest && <p><Link href="/signup">Sign up</Link> to save your progress.</p>}

      {units.map((unit) => (
        <div key={unit.id}>
          <h2>{unit.title}</h2>
          {unit.lessons.map(lesson => (
            <div key={lesson.id}>
              <h3 key={lesson.id}>{lesson.title}</h3>
              <Link href={`/lesson/${lesson.id}`}>Start</Link>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
