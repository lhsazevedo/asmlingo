import { container } from "@/server/container";

export async function POST() {
  await container.createScope().resolve("SignOutUseCase").execute();
  return new Response(null, { status: 204 });
}
