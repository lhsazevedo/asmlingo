export interface User {
  id: number;
  isGuest: boolean;
  email?: string;
  name?: string;
  password?: string;
  currentLessonId?: number;
  currentUnitId?: number;
}
