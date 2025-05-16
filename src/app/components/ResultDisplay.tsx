// ResultDisplay.tsx

"use client";

import React from 'react';

interface ResultDisplayProps {
  currentGPA: string;
  overallGPA?: string;
}

export default function ResultDisplay({ currentGPA, overallGPA }: ResultDisplayProps) {
  if (!currentGPA) return null;
  
  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Results</h3>
      
      <div className="text-red-600 font-medium">
        Your cumulative GPA for current semester is {currentGPA}
      </div>
      
      {overallGPA && (
        <div className="text-red-600 font-medium mt-2">
          Your overall cumulative GPA will be {overallGPA}
        </div>
      )}
    </div>
  );
}