"use client";

import { useState, useEffect, useCallback } from "react";
import { LessonList } from "@/components/LessonList";
import { HomeHeader } from "@/components/HomeHeader";
import { Roadmap } from "@/core/actions/GetRoadmapAction";
import { useAuth } from "./AuthProvider";

export default function Home() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoadmap = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/roadmap");
      if (!response.ok) {
        throw new Error("Failed to fetch roadmap");
      }
      const data = (await response.json()) as { data: Roadmap };
      setRoadmap(data.data);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRoadmap();
  }, [fetchRoadmap, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <HomeHeader user={user} />
      <LessonList
        units={roadmap}
        currentLessonId={user?.currentLessonId ?? undefined}
      />
    </>
  );
}
