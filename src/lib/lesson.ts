import db from "@/lib/db";

export async function getLessonProgress(userId: number, lessonId: number) {
  return db.lessonProgress.findUnique({
    where: {
      userId_lessonId: { userId, lessonId },
    },
  });
}

export async function createLessonProgress(userId: number, lessonId: number) {
  return db.lessonProgress.create({
    data: {
      userId,
      lessonId,
      finishedAt: new Date(),
    },
  });
}

export async function getUnitWithLessonsByLesson(lessonId: number) {
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      unit: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  return lesson;
}

export async function getCompletedLessonsCount(
  userId: number,
  unitLessons: { id: number }[],
) {
  return db.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: unitLessons.map((l) => l.id) },
      finishedAt: { not: null },
    },
  });
}

export async function createUnitProgress(userId: number, unitId: number) {
  return db.unitProgress.create({
    data: {
      userId,
      unitId,
      finishedAt: new Date(),
    },
  });
}

export async function updateUserCurrentLesson(
  userId: number,
  newLessonId: number,
) {
  return db.user.update({
    where: { id: userId },
    data: {
      currentLessonId: newLessonId,
    },
  });
}

export async function updateUserCurrentUnit(userId: number, newUnitId: number) {
  return db.user.update({
    where: { id: userId },
    data: {
      currentUnitId: newUnitId,
    },
  });
}
