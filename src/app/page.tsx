import Link from "next/link";
import styles from "./page.module.css";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";
import { User } from "@prisma/client";
import prisma from "@/lib/db";

async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  let user: User;
  if (!session.userId) {
    user = await prisma.user.create({ data: { isGuest: true } });
  } else {
    // TODO: Handle user not found
    user = await prisma.user.findUniqueOrThrow({
      where: { id: session.userId },
    });
  }

  // TODO: Rethink return type
  return { session, user };
}

export default async function Page() {
  const { user } = await getSession();

  const units = await prisma.unit.findMany({
    orderBy: { order: "asc" },
    include: { lessons: true },
  });

  return (
    <main className={styles.main}>
      <h1>Hi {user.isGuest ? "Guest" : user.name}!</h1>

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
