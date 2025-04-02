'use client'

import { useState } from 'react'
import styles from './lecture.module.css'

interface Student {
  id: number
  name: string
  score: number
  contribution: string[]
}

export default function LecturePage(): JSX.Element {
  const [students] = useState<Student[]>([
    {
      id: 1,
      name: 'Name 1',
      score: 6,
      contribution: ['Contribution 1', 'Contrbution 2', 'contribution3'],
    },
    {
      id: 2,
      name: 'Name 2',
      score: 5,
      contribution: ['Contribution 1', 'contribution3'],
    },
    {
      id: 3,
      name: 'Name 3',
      score: 2,
      contribution: ['Contribution 1'],
    },
    {
      id: 4,
      name: 'Name 4',
      score: 5,
      contribution: ['Contribution 1'],
    },
    {
      id: 5,
      name: 'Name 5',
      score: 3,
      contribution: ['Contribution 1', 'Contrbution 2', 'contribution3'],
    },
  ])

  const currentDate = new Date().toLocaleDateString()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Lecture: 2257 Lecture</h1>

      <div className="flex items-center mb-8">
        <h2 className="text-2xl font-semibold">Date:</h2>
        <span className="ml-4 text-2xl">{currentDate}</span>
      </div>

      <div className="bg-background rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex justify-between items-start p-4 border-b border-gray-200 last:border-0"
            >
              <div className="flex flex-col">
                <span className="text-lg font-medium">{student.name}</span>
                {student.contribution.map((contribution) => (
                  <span
                    key={contribution}
                    className="text-sm text-gray-600 mt-1"
                  >
                    Class Comment: "{contribution}"
                  </span>
                ))}

                {/* <span className="text-sm text-gray-600 mt-1">
                  {student.contribution}
                </span> */}
              </div>
              <span className="text-lg font-semibold">{student.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
