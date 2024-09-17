import { container } from "@/server/container";

export async function POST() {
  await container.createScope().resolve("SignOutAction").execute();
  return new Response(null, { status: 204 });
}
