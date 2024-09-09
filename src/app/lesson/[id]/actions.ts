"use server";

import { getOrCreateSession } from '@/lib/session';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export async function finish({ lessonId }: { lessonId: number }) {
  const { user } = await getOrCreateSession();

  // Eager load user progress
  const userData = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      currentLessonId: true,
      currentUnitId: true,
      lessonProgress: {
        where: {
          finishedAt: { not: null },
        },
        select: {
          lessonId: true,
        },
      },
      unitProgress: {
        where: {
          finishedAt: { not: null },
        },
        select: {
          unitId: true,
        },
      },
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const allUnits = await db.unit.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      lessons: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          unitId: true,
        },
      },
    },
  });

  const currentLesson = allUnits.flatMap(u => u.lessons).find(l => l.id === lessonId);
  if (!currentLesson) {
    throw new Error("Lesson not found");
  }
  const currentUnit = allUnits.find(u => u.id === currentLesson.unitId);
  if (!currentUnit) {
    throw new Error("Unit not found");
  }

  // Pass if the lesson is already completed
  if (userData.lessonProgress.some(lp => lp.lessonId === lessonId)) {
    redirect("/");
  }

  // Create lesson progress
  await db.lessonProgress.create({
    data: {
      userId: user.id,
      lessonId,
      finishedAt: new Date(),
    },
  });

  const completedLessonsCount = userData.lessonProgress.filter(
    lp => currentUnit.lessons.some(l => l.id === lp.lessonId)
  ).length + 1;

  if (completedLessonsCount === currentUnit.lessons.length) {
    // All lessons in the unit are completed
    await db.unitProgress.create({
      data: {
        userId: user.id,
        unitId: currentUnit.id,
        finishedAt: new Date(),
      },
    });
    // Update user's current unit and lesson id
    const nextUnit = allUnits.find(u => u.id === currentUnit.id + 1);
    const nextLesson = nextUnit?.lessons[0];
    if (nextLesson) {
      await db.user.update({
        where: { id: user.id },
        data: {
          currentUnitId: nextUnit.id,
          currentLessonId: nextLesson.id,
        },
      });
    }
  } else {
    // Update user's current lesson id
    const nextLesson = currentUnit.lessons[completedLessonsCount];
    await db.user.update({
      where: { id: user.id },
      data: {
        currentLessonId: nextLesson.id,
      },
    });
  }

  redirect("/");
}
