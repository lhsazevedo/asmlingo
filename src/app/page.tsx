export const dynamic = "force-dynamic";

import styles from "./page.module.css";
import { LessonList } from "@/components/LessonList";
import clsx from "clsx";
import { container } from "@/container";
import { HomeHeader } from "@/components/HomeHeader";

export default async function Page() {
  const scoped = container.createScope();
  const auth = scoped.resolve("auth");
  const session = await scoped.resolve("pendingSession");
  const user = await auth.user();

  const roadmap = await scoped.resolve("GetRoadmapAction").execute();

  return (
    <main className={clsx("px-2", styles.main)}>
      <HomeHeader user={user} session={{ ...session.all() }} />
      <LessonList
        units={roadmap}
        currentLessonId={user?.currentLessonId ?? undefined}
      />
    </main>
  );
}
