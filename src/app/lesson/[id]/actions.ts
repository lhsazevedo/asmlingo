"use server";

import db from "@/lib/db";
import { getOrCreateSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function finish({ lessonId }: { lessonId: number }) {
  const { user } = await getOrCreateSession();

  if (
    await db.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        },
      },
    })
  ) {
    redirect("/");
  }

  await db.lessonProgress.create({
    data: {
      userId: user.id,
      lessonId,
      finishedAt: new Date(),
    },
  });

  // If all lessons of this unit are completed, mark the unit as completed
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { unit: { include: { lessons: true } } },
  });

  if (lesson) {
    const completedLessonsCount = await db.lessonProgress.count({
      where: {
        userId: user.id,
        lessonId: { in: lesson.unit.lessons.map((l) => l.id) },
        finishedAt: { not: null },
      },
    });

    if (completedLessonsCount === lesson.unit.lessons.length) {
      await db.unitProgress.create({
        data: {
          userId: user.id,
          unitId: lesson.unitId,
          finishedAt: new Date(),
        },
      });
    }
  }

  redirect("/");
}
