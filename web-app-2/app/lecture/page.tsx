<<<<<<< HEAD
'use client'
import { useState, useEffect } from 'react'
import styles from './lecture.module.css'
import { Class } from './testfile.json' // Import JSON file
// import { Lectures } from './testfile.json' // Import JSON file
=======
"use client";
import { useState } from "react";
import styles from "./lecture.module.css";
import { Class } from "./testfile.json"; // Import JSON file
import { Lectures } from "./testfile.json"; // Import JSON file
>>>>>>> 27df7437832cf843875f0430667677688f91e03d

import { NextResponse } from "next/server";

<<<<<<< HEAD
/// Update interface to match MongoDB response
interface Contribution {
  name: string
  said: string
  score: number
}

interface Lecture {
  _id: {
    $oid: string
  }
  class_name: string
  date: {
    $date: number
  }
  contrib: Contribution[]
=======
export async function GET() {
  try {
    // Figure out how to fetch data from the server

    const res = await fetch("http://localhost:8000/classes");
    const data = await res.json();
    console.log("Fetched data:", data); // Log the fetched data
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lectures" },
      { status: 500 }
    );
  }
}

interface Student {
  id: number;
  name: string;
  score: number;
  contribution: string[];
>>>>>>> 27df7437832cf843875f0430667677688f91e03d
}

export default function LecturePage(): JSX.Element {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

<<<<<<< HEAD
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await fetch('http://localhost:8000/lectures/list')
        if (!response.ok) throw new Error('Failed to fetch lectures')
        const data = await response.json()
        // Parse JSON strings in the response
        const parsedLectures = data.lectures.map((lecture: string) =>
          JSON.parse(lecture)
        )
        setLectures(parsedLectures)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch lectures'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLectures()
  }, [])

  // Add a nicer loading page
  if (loading)
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/4 mb-8"></div>
            <div className="bg-gray-100 rounded-lg shadow-lg p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div
                    key={j}
                    className="flex justify-between items-center p-4 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex flex-col w-3/4">
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  if (error) return <div>Error: {error}</div>
  if (!lectures || lectures.length === 0) return <div>No lectures found</div>

  return (
    <>
      {lectures.map((lecture) => (
        <div key={lecture._id.$oid} className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">
            Section Name: {lecture.class_name}
          </h1>
=======
  const analyzeContribution = (text: string): number => {
    // Base metrics
    const words = text.split(" ");
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / words.length;

    // Smart words indicators
    const smartWords = [
      "therefore",
      "however",
      "moreover",
      "specifically",
      "furthermore",
      "analysis",
      "conclude",
      "because",
      "research",
      "evidence",
      "Inclinded",
      "Which means",
      "In addition",
      "In conclusion",
    ];
    const smartWordCount = words.filter((word) =>
      smartWords.includes(word.toLowerCase())
    ).length;

    // Calculate score components
    const lengthScore = Math.min(words.length / 20, 1) * 3; // Up to 3 points for length
    const uniqueScore = (uniqueWords.size / words.length) * 2; // Up to 2 points for variety
    const complexityScore = Math.min(avgWordLength / 6, 1) * 2; // Up to 2 points for word length
    const smartScore = Math.min(smartWordCount / 3, 1) * 3; // Up to 3 points for smart words

    // Calculate final score
    const totalScore = Math.round(
      lengthScore + uniqueScore + complexityScore + smartScore
    );

    // Ensure score is between 1 and 10
    return Math.max(1, Math.min(10, totalScore));
  };

  return (
    <div data-component="LecturePage">
      {Lectures.map((Lecture) => (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">Lecture: 2257 Lecture</h1>

>>>>>>> 27df7437832cf843875f0430667677688f91e03d
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-semibold">Date:</h2>
            <span className="ml-4 text-2xl">
              {new Date(lecture.date.$date).toLocaleDateString()}
            </span>
          </div>
          <div className="bg-background rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              {lecture.contrib.map((contribution, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border-b border-gray-200 last:border-0"
                >
                  <div className="flex flex-col max-w-[85%]">
                    <span className="text-lg font-medium">
                      {contribution.name}
                    </span>
                    <span className="text-sm text-gray-500 mt-1 mr-32">
                      <b>Class Comment:</b> &quot;{contribution.said}&quot;
                    </span>
                  </div>
                  <span className="text-lg font-semibold">
<<<<<<< HEAD
                    Total Score: <b>{contribution.score}/10</b>
=======
                    Total Score:{" "}
                    <b>{analyzeContribution(contribution.said)}/10</b>
>>>>>>> 27df7437832cf843875f0430667677688f91e03d
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
