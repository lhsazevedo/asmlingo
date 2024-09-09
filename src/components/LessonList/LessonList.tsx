"use client";

import { Prisma } from '@prisma/client';
import { LessonButton } from '../LessonButton';
import styles from './LessonList.module.css';
import { LessonButtonVariant } from '../LessonButton/LessonButton';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const unitWithRelations = Prisma.validator<Prisma.UnitDefaultArgs>()({
  include: {
    lessons: {
      include: {
        lessonProgress: {
          where: {
            userId: 0,
          },
          take: 1,
        },
      },
    },
    unitProgress: {
      where: {
        userId: 0,
      },
      take: 1,
    },
  },
})

type UnitWithRelations = Prisma.UnitGetPayload<typeof unitWithRelations>

export interface LessonListProps {
  units: UnitWithRelations[];
  currentLessonId?: number;
  currentUnitId?: number;
}

export function LessonList({
  units,
  currentLessonId,
  currentUnitId,
}: Readonly<LessonListProps>) {
  const router = useRouter();

  return (
    <div className={clsx('max-w-md mx-auto', styles.root)}>
      {units.map(unit => (
        <div key={unit.id} className="mb-16">
          <div className="text-lg text-gray-400 font-bold text-center">
            Unit {unit.order + 1}: {unit.title}
          </div>
          {unit.lessons.map(lesson => {
            const isCompleted = !!lesson?.lessonProgress?.[0]?.finishedAt;
            const isCurrent = (currentLessonId && (lesson.id === currentLessonId))
              || (unit.order === 0 && lesson.order === 0);

            let variant: LessonButtonVariant = "disabled";
            if (isCompleted) {
              variant = "default";
            } else if (isCurrent) (
              variant = "current"
            )

            return (
              <div key={lesson.id} className="mt-10 flex items-center space-x-4 md:space-x-6">
                <LessonButton
                  variant={variant}
                  onClick={() => {
                    router.push(`/lesson/${lesson.id}`);
                  }}
                />
                <div>
                  <div className='sm:text-lg text-gray-600 font-semibold'>{ lesson.title }</div>
                  <div className='hidden sm:block text-md text-gray-400'>{ lesson.description }</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
