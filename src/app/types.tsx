// types.tsx

// Type definitions for the GPA calculator app

export interface ModuleGrade {
  grade: string;
}

export interface GPAResult {
  currentGPA: string;
  overallGPA?: string;
}

export type SMUGradeObject = Record<string, number>;