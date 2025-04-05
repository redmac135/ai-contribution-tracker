'use client'
import { useState, useEffect } from 'react'
import styles from './lecture.module.css'
import { Class } from './testfile.json' // Import JSON file
// import { Lectures } from './testfile.json' // Import JSON file

import { NextResponse } from 'next/server'

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
}

export default function LecturePage(): JSX.Element {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
                    Total Score: <b>{contribution.score}/10</b>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
