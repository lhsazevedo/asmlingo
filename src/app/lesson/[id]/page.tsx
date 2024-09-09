import { LessonController } from "@/components/LessonController";
import prisma from "@/lib/db";

export default async function Page({ params }: { params: { id: string } }) {
  // TODO: Handle non-numeric id
  const parsedId = parseInt(params.id);

  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: parsedId },
    select: { challenges: true },
  });

  const challenges = JSON.parse(lesson.challenges);

  return (
    <LessonController
      lessonId={parsedId}
      challenges={challenges}
    />
  );
}
