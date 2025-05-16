// gpaUtils.tsx

/**
 * Utility functions for GPA calculation
 */

/**
 * Calculates current semester GPA
 * @param grades Array of grades entered
 * @param gradePoints Object mapping grades to point values
 * @returns The GPA for the current semester
 */
export const calculateSemesterGPA = (
  grades: string[], 
  gradePoints: Record<string, number>
): number => {
  let sum = 0;
  
  for (const grade of grades) {
    const upperGrade = grade.trim().toUpperCase();
    if (typeof upperGrade === "string" && gradePoints.hasOwnProperty(upperGrade)) {
      sum += gradePoints[upperGrade];
    } else {
      throw new Error(`Invalid grade: ${grade}`);
    }
  }
  
  return sum / grades.length;
};

/**
 * Calculates overall GPA considering past GPA
 * @param currentGPA Current semester GPA
 * @param moduleCount Number of modules in current semester
 * @param pastGPA Past cumulative GPA
 * @param pastNumMods Number of modules taken before
 * @returns The overall GPA
 */
export const calculateOverallGPA = (
  currentGPA: number,
  moduleCount: number,
  pastGPA: number,
  pastNumMods: number
): number => {
  return ((pastGPA * pastNumMods) + currentGPA * moduleCount) / (moduleCount + pastNumMods);
};

/**
 * Returns honorary distinction based on GPA
 * @param gpa The GPA value
 * @returns String representation of the honorary distinction
 */
export const getHonoraryDistinction = (gpa: number): string => {
  if (gpa >= 3.8) {
    return "Summa Cum Laude";
  } else if (gpa >= 3.7) {
    return "Magna Cum Laude";
  } else if (gpa >= 3.6) {
    return "Magna Cum Laude";
  } else if (gpa >= 3.4) {
    return "Cum Laude";
  } else if (gpa >= 3.2) {
    return "High Merit";
  } else if (gpa >= 3.0) {
    return "Merit";
  }
  return "";
};