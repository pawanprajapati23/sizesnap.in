"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Percent, 
  GraduationCap, 
  Award, 
  FileText, 
  CalendarDays, 
  Calendar, 
  BookOpen, 
  Target, 
  ClipboardList, 
  Clock,
  Search,
  ArrowRight
} from 'lucide-react';

const CALCULATORS = [
  {
    name: "Percentage Calculator",
    description: "Calculate basic percentages quickly and easily for any number.",
    url: "/percentage-calculator",
    icon: Percent,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    name: "CGPA to Percentage",
    description: "Convert your CGPA to percentage using standard university multipliers.",
    url: "/cgpa-to-percentage",
    icon: GraduationCap,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    name: "SGPA to Percentage",
    description: "Easily convert your semester SGPA to an overall percentage score.",
    url: "/sgpa-to-percentage",
    icon: Award,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    name: "Marks Percentage Calculator",
    description: "Find out the percentage of marks obtained out of total marks.",
    url: "/marks-percentage-calculator",
    icon: FileText,
    color: "text-red-600",
    bg: "bg-red-50"
  },
  {
    name: "Attendance Calculator",
    description: "Calculate how many classes you can miss or need to attend to meet criteria.",
    url: "/attendance-calculator",
    icon: CalendarDays,
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    name: "Age Calculator",
    description: "Calculate your exact age in years, months, and days for exam forms.",
    url: "/age-calculator",
    icon: Calendar,
    color: "text-teal-600",
    bg: "bg-teal-50"
  },
  {
    name: "CGPA Calculator",
    description: "Calculate your overall CGPA from your semester grades or SGPA.",
    url: "/cgpa-calculator",
    icon: BookOpen,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    name: "Required Marks Calculator",
    description: "Find out exactly how many marks you need in finals to get a specific grade.",
    url: "/required-marks-calculator",
    icon: Target,
    color: "text-rose-600",
    bg: "bg-rose-50"
  },
  {
    name: "Exam Percentage Calculator",
    description: "Calculate your final exam percentage across multiple subjects.",
    url: "/exam-percentage-calculator",
    icon: ClipboardList,
    color: "text-cyan-600",
    bg: "bg-cyan-50"
  },
  {
    name: "Study Hours Calculator",
    description: "Plan and track your daily study hours to complete your syllabus on time.",
    url: "/study-hours-calculator",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50"
  }
];

export default function StudentCalculatorsClient() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalculators = CALCULATORS.filter(calc => 
    calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    calc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-8 relative max-w-2xl mx-auto lg:mx-0">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search calculators (e.g., CGPA, Percentage, Attendance)..."
          className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#414FA8] focus:border-[#414FA8] sm:text-sm transition-shadow shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search calculators"
        />
      </div>

      {/* Calculator Grid */}
      {filteredCalculators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredCalculators.map((calc, idx) => (
            <Link 
              key={idx} 
              href={calc.url}
              className="flex flex-col bg-white border border-gray-200 rounded-lg p-5 hover:border-[#414FA8] hover:shadow-md transition-all group focus:outline-none focus:ring-2 focus:ring-[#414FA8]"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${calc.bg} ${calc.color} shrink-0`}>
                  <calc.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#414FA8] transition-colors truncate">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {calc.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm font-medium text-[#414FA8]">
                <span>Open Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-50 text-gray-400 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No calculators found</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            We couldn&apos;t find any calculator matching &quot;{searchQuery}&quot;. Try checking for typos or using different keywords.
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#414FA8]"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
