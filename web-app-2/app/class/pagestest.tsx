'use client'

import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

interface Class {
  _id: string
  name: string
  students: string[]
}

interface ClassesResponse {
  classes: string[] // Array of JSON strings
}

const ClassesPage = () => {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/classes/getAllClasses/')
      .then((response) => response.json())
      .then((data: ClassesResponse) => {
        const parsedClasses = data.classes.map((classStr) =>
          JSON.parse(classStr)
        )
        setClasses(parsedClasses)
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to fetch classes')
        setLoading(false)
      })
  }, [])

  console.log('Classes:', classes)

  if (loading)
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="animate-pulse grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )

  if (error) return <div>Error: {error}</div>

  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold mb-6">Available Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">{classItem.name}</h2>
            <p className="text-gray-600">Students: {classItem.students}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClassesPage
