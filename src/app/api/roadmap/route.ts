import { container } from "@/server/container";

export async function GET() {
  const scoped = container.createScope();

  const roadmap = await scoped.resolve("GetRoadmapUseCase").execute();

  return Response.json({ data: roadmap });
}
