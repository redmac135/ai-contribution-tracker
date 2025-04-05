'use client'
import { useState } from 'react'
import styles from './lecture.module.css'
import { Class } from './testfile.json' // Import JSON file
import { Lectures } from './testfile.json' // Import JSON file

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Figure out how to fetch data from the server

    const res = await fetch('http://localhost:8000/lectures')
    const data = await res.json()
    console.log('Fetched data:', data) // Log the fetched data
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lectures' },
      { status: 500 }
    )
  }
}

interface Student {
  id: number
  name: string
  score: number
  contribution: string[]
}

export default function LecturePage(): JSX.Element {
  // console.log('Test JSON data:', Class) // Log the imported data

  const analyzeContribution = (text: string): number => {
    // Base metrics
    const words = text.split(' ')
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()))
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / words.length

    // Smart words indicators
    const smartWords = [
      'therefore',
      'however',
      'moreover',
      'specifically',
      'furthermore',
      'analysis',
      'conclude',
      'because',
      'research',
      'evidence',
      'Inclinded',
      'Which means',
      'In addition',
      'In conclusion',
    ]
    const smartWordCount = words.filter((word) =>
      smartWords.includes(word.toLowerCase())
    ).length

    // Calculate score components
    const lengthScore = Math.min(words.length / 20, 1) * 3 // Up to 3 points for length
    const uniqueScore = (uniqueWords.size / words.length) * 2 // Up to 2 points for variety
    const complexityScore = Math.min(avgWordLength / 6, 1) * 2 // Up to 2 points for word length
    const smartScore = Math.min(smartWordCount / 3, 1) * 3 // Up to 3 points for smart words

    // Calculate final score
    const totalScore = Math.round(
      lengthScore + uniqueScore + complexityScore + smartScore
    )

    // Ensure score is between 1 and 10
    return Math.max(1, Math.min(10, totalScore))
  }

  return (
    <>
      {Lectures.map((Lecture) => (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">Lecture: 2257 Lecture</h1>

          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-semibold">Date:</h2>
            <span className="ml-4 text-2xl">{Lecture.date}</span>
          </div>

          <div className="bg-background rounded-lg shadow-lg p-6">
            <div className="space-y-4">
              {Lecture.Contribution.map((contribution) => (
                <div className="flex justify-between items-center p-4 border-b border-gray-200 last:border-0">
                  <div className="flex flex-col max-w-[85%]">
                    <span className="text-lg font-medium">
                      {contribution.name}
                    </span>
                    <span className="text-sm text-gray-500 mt-1 mr-32">
                      <b>Class Comment:</b> &quot;{contribution.said}&quot;
                    </span>
                  </div>
                  <span className="text-lg font-semibold">
                    Total Score:{' '}
                    <b>{analyzeContribution(contribution.said)}/10</b>
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
