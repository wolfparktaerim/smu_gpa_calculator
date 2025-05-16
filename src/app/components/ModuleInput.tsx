// ModuleInput.tsx
"use client";

import React from 'react';

interface ModuleInputProps {
  index: number;
  grade: string;
  onChange: (index: number, value: string) => void;
}

export default function ModuleInput({ index, grade, onChange }: ModuleInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={`grade${index}`} className="block text-sm font-medium mb-1">
        Enter grade for module {index + 1}:
      </label>
      <input 
        type="text" 
        id={`grade${index}`} 
        className="w-full rounded border border-gray-300 p-2" 
        placeholder="A+, B, C-, etc (can be lowercase)"
        value={grade}
        onChange={(e) => onChange(index, e.target.value)}
        required
      />
    </div>
  );
}