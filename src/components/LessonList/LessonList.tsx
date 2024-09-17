"use client";

import { LessonButton } from "../LessonButton";
import styles from "./LessonList.module.css";
import { LessonButtonVariant } from "../LessonButton/LessonButton";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Roadmap } from "@/server/core/cases/GetRoadmapUseCase";
export interface LessonListProps {
  units: Roadmap;
  currentLessonId?: number;
}

export function LessonList({ units }: Readonly<LessonListProps>) {
  const router = useRouter();

  return (
    <div className={clsx("max-w-md mx-auto", styles.root)}>
      {units.map((unit) => (
        <div key={unit.id} className="mb-16">
          <div className="text-lg text-gray-400 font-bold text-center">
            Unit {unit.order + 1}: {unit.title}
          </div>
          {unit.lessons.map((lesson) => {
            let variant: LessonButtonVariant = "disabled";
            if (lesson.isFinished) {
              variant = "default";
            } else if (lesson.isCurrent) {
              variant = "current";
            }

            return (
              <div
                key={lesson.id}
                className="mt-10 flex items-center space-x-6"
              >
                <LessonButton
                  variant={variant}
                  onClick={() => {
                    router.push(`/lesson/${lesson.id}`);
                  }}
                  aria-labelledby={`lesson-${lesson.id}-title`}
                />
                <div>
                  <div
                    id={`lesson-${lesson.id}-title`}
                    className="sm:text-lg text-gray-600 font-semibold"
                  >
                    {lesson.title}
                  </div>
                  <div className="hidden sm:block text-md text-gray-400">
                    {lesson.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
