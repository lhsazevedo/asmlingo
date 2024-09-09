import CloseIcon from "@/icons/CloseIcon";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export interface LessonControllerHeaderProps {
  challengesCount: number;
  currentChallengeIndex: number;
}

export function LessonControllerHeader({
  challengesCount,
  currentChallengeIndex,
}: LessonControllerHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <button
        className="fill-gray-300 hover:bg-gray-100 rounded-full p-2 -ml-2"
        onClick={() => router.push("/")}
      >
        <CloseIcon size={28} />
      </button>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden ml-2">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: `${(0 / challengesCount) * 100}%` }}
          animate={{
            width: `${(currentChallengeIndex / challengesCount) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
