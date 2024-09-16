import { LessonController } from "@/components/LessonController";
import prisma from "@/lib/db";
import { GapFillChallengeData } from "@/types";

export default async function Page({ params }: { params: { id: string } }) {
  // TODO: Handle non-numeric id
  const parsedId = parseInt(params.id);

  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { id: parsedId },
    select: { challenges: true },
  });

  const challenges = JSON.parse(lesson.challenges) as GapFillChallengeData[];

  return <LessonController lessonId={parsedId} challenges={challenges} />;
}
