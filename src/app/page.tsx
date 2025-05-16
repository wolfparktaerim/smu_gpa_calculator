"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModuleGrade } from "./types";
import {
  calculateSemesterGPA,
  calculateOverallGPA,
  getHonoraryDistinction,
} from "./utils/gpaUtils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the ModuleInput component with radio buttons
const ModuleInput = ({ 
  index, 
  grade, 
  onChange 
}: { 
  index: number; 
  grade: string; 
  onChange: (index: number, value: string) => void;
}) => {
  const grades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">Module {index + 1}</h3>
        <span className={`text-sm font-medium px-2 py-1 rounded ${
          grade ? (
            grade.startsWith('A') ? 'bg-green-100 text-green-800' :
            grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
            grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
            grade.startsWith('D') ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          ) : 'bg-gray-100 text-gray-600'
        }`}>
          {grade || "No Grade"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-2">
        {grades.map((g) => (
          <div 
            key={g} 
            className={`
              flex items-center justify-center p-2 rounded-md border cursor-pointer transition-all
              ${grade === g 
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium shadow-sm' 
                : 'border-gray-200 hover:bg-gray-50'
              }
            `}
            onClick={() => onChange(index, g)}
          >
            {g}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function GpaCalculator() {
  const [moduleCount, setModuleCount] = useState<number>(4);
  const [modules, setModules] = useState<ModuleGrade[]>([]);
  const [pastGPA, setPastGPA] = useState<string>("");
  const [pastNumMods, setPastNumMods] = useState<string>("");
  const [showPastNumMods, setShowPastNumMods] = useState<boolean>(false);
  const [currentGPA, setCurrentGPA] = useState<string>("");
  const [overallGPA, setOverallGPA] = useState<string>("");
  const [smuGpaObj, setSmuGpaObj] = useState<Record<string, number>>({});
  const [calculating, setCalculating] = useState<boolean>(false);

  useEffect(() => {
    fetch("/smu_gpa_obj.json")
      .then((res) => res.json())
      .then(setSmuGpaObj)
      .catch((err) => {
        console.error("Error loading GPA data:", err);
        toast.error("Failed to load GPA data. Please refresh the page.");
      });
  }, []);

  useEffect(() => {
    setModules(Array(moduleCount).fill(null).map(() => ({ grade: "" })));
  }, [moduleCount]);

  const handlePastGPAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPastGPA(value);
    setShowPastNumMods(value !== "");
  };

  const handleGradeChange = (index: number, value: string) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], grade: value };
    setModules(updated);
  };

  const calculateGPA = () => {
    setCalculating(true);
    setCurrentGPA("");
    setOverallGPA("");

    if (!moduleCount) {
      toast.warning("Please select the number of modules you have taken.");
      setCalculating(false);
      return;
    }

    // Check if all modules have grades
    const emptyModules = modules.filter(m => !m.grade).length;
    if (emptyModules > 0) {
      toast.warning(`Please select grades for all ${emptyModules} remaining modules.`);
      setCalculating(false);
      return;
    }

    try {
      const grades = modules.map((m) => m.grade);
      const semesterGPA = calculateSemesterGPA(grades, smuGpaObj);
      const cumulativeGPA = semesterGPA.toFixed(2);
      setCurrentGPA(cumulativeGPA);

      const pastGPAValue = parseFloat(pastGPA);
      const pastNumModsValue = parseFloat(pastNumMods);

      if (
        pastGPA !== "" &&
        !isNaN(pastGPAValue) &&
        pastNumMods !== "" &&
        !isNaN(pastNumModsValue)
      ) {
        if (pastGPAValue < 0 || pastGPAValue > 4.3) {
          toast.error("Please enter a valid value for your past GPA (0 to 4.3)!");
          setCalculating(false);
          return;
        }
        if (pastNumModsValue < 0 || pastNumModsValue > 100) {
          toast.error("Please enter a valid value for your past number of modules!");
          setCalculating(false);
          return;
        }

        const overallGPAValue = calculateOverallGPA(
          semesterGPA,
          moduleCount,
          pastGPAValue,
          pastNumModsValue
        );

        setOverallGPA(overallGPAValue.toFixed(2));

        const distinction = getHonoraryDistinction(overallGPAValue);
        if (distinction) {
          let message = `You will get ${distinction}!`;
          if (distinction === "Summa Cum Laude") {
            message += " You sir/ma'am, are a genius!";
            toast.success(message);
          } else if (
            distinction === "Magna Cum Laude" &&
            overallGPAValue >= 3.7
          ) {
            message += " Owwwww dean lister, time to show off to friends!";
            toast.success(message);
          } else if (distinction === "Magna Cum Laude") {
            message += " Keep up and you will become a dean lister!";
            toast.success(message);
          } else if (distinction === "Cum Laude") {
            message += " Higher employment rate and starting salary await you!";
            toast.success(message);
          }
        }
      } else {
        const currentGPAValue = parseFloat(cumulativeGPA);
        const distinction = getHonoraryDistinction(currentGPAValue);

        if (distinction) {
          let message = `You will get ${distinction}!`;
          if (distinction === "Summa Cum Laude") {
            message += " You sir/ma'am, are a genius!";
            toast.success(message);
          } else if (
            distinction === "Magna Cum Laude" &&
            currentGPAValue >= 3.7
          ) {
            message += " Owwwww dean lister, time to show off to friends!";
            toast.success(message);
          } else if (distinction === "Magna Cum Laude") {
            message += " Keep up and you will become a dean lister!";
            toast.success(message);
          } else if (distinction === "Cum Laude") {
            message += " Higher employment rate and starting salary await you!";
            toast.success(message);
          }
        }
      }
      
      toast.info("GPA calculation completed successfully!", { 
        position: "top-right",
        autoClose: 3000
      });
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An error occurred during calculation");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center py-8 px-4 bg-gray-50">
      <ToastContainer position="top-right" />
      
      <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/icons/smu.png"
            alt="SMU Logo"
            width={50}
            height={50}
            className="mr-4"
          />
          <h1 className="text-3xl font-bold text-center text-gray-800">
            SMU GPA Calculator
          </h1>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <h2 className="font-medium text-blue-800 mb-1">Setup Your Calculation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label htmlFor="moduleCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of modules taken this semester:
              </label>
              <select
                id="moduleCount"
                className="w-full rounded-lg border border-gray-300 p-2 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                value={moduleCount}
                onChange={(e) => setModuleCount(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} module{n !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="pastGPA" className="block text-sm font-medium text-gray-700 mb-1">
                Past cumulative GPA (optional):
              </label>
              <input
                type="number"
                id="pastGPA"
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                min={0}
                max={4.3}
                step="0.01"
                placeholder="e.g. 3.75"
                value={pastGPA}
                onChange={handlePastGPAChange}
              />
            </div>

            {showPastNumMods && (
              <div className="md:col-span-2">
                <label htmlFor="pastNumMods" className="block text-sm font-medium text-gray-700 mb-1">
                  Total number of modules taken previously:
                </label>
                <input
                  type="number"
                  id="pastNumMods"
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  min={0}
                  placeholder="e.g. 20"
                  value={pastNumMods}
                  onChange={(e) => setPastNumMods(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
            Select Your Grades
          </h2>
          
          <div className="space-y-4">
            {modules.map((module, index) => (
              <ModuleInput
                key={index}
                index={index}
                grade={module.grade}
                onChange={handleGradeChange}
              />
            ))}
          </div>
        </div>

        <button
          onClick={calculateGPA}
          disabled={calculating}
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white transition-all
            ${calculating 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
            }
          `}
        >
          {calculating ? "Calculating..." : "Calculate GPA"}
        </button>

        {(currentGPA || overallGPA) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">Results</h3>
            
            {currentGPA && (
              <div className="flex items-center justify-between p-3 bg-white rounded mb-2 shadow-sm">
                <span className="text-gray-700">This semester&apos;s GPA:</span>
                <span className="text-lg font-bold text-blue-600">{currentGPA}</span>
              </div>
            )}
            
            {overallGPA && (
              <div className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
                <span className="text-gray-700">Overall cumulative GPA:</span>
                <span className="text-lg font-bold text-green-600">{overallGPA}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer className="text-center text-gray-500 text-sm mb-4">
        © {new Date().getFullYear()} SMU GPA Calculator • Built with ❤️ for SMU Students
      </footer>
    </main>
  );
}