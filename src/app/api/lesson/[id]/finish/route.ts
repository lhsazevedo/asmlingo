import { created, notFound } from "@/app/api/util";
import { container } from "@/container";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const lessonId = parseInt(params.id);
  if (isNaN(lessonId)) {
    return notFound();
  }

  await container.resolve("FinishLessonAction").execute(lessonId);

  return created(null);
}
