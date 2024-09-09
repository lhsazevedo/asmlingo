"use server";

import db from "@/lib/db";
import { getOrCreateSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function finish({ lessonId }: { lessonId: number }) {
  const { user } = await getOrCreateSession();

  await db.lessonProgress.create({
    data: {
      userId: user.id,
      lessonId,
      finishedAt: new Date(),
    },
  });

  redirect('/');
}
