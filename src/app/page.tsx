export const dynamic = "force-dynamic";

import styles from "./page.module.css";
import db from "@/lib/db";
import { LessonList } from "@/components/LessonList";
import clsx from "clsx";
import { container } from "@/container";
import { HomeHeader } from "@/components/HomeHeader";

export default async function Page() {
  const session = await container.resolve("pendingSession");

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

  const userRepo = container.resolve("userRepository");

  const userId = session.get("userId");
  const user = userId ? await userRepo.find(userId) : null;

  return (
    <main className={clsx("px-2", styles.main)}>
      <HomeHeader user={user} session={{ ...session.all() }} />
      <LessonList
        units={units}
        currentLessonId={user?.currentLessonId ?? undefined}
      />
    </main>
  );
}
