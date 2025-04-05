// Felixes old Page
'use client'

import React, { useEffect, useState } from 'react'
import styles from './page.module.css'

// Add interfaces
interface Contribution {
  [date: string]: number
}

interface Student {
  [name: string]: Contribution
}

interface ApiResponse {
  class: string
  students: Student
  error?: string
}

interface ProcessedStudent {
  name: string
  contributions: number[]
}

const TablePage = () => {
  const [students, setStudents] = useState<any[]>([])
  const [dates, setDates] = useState<string[]>([])
  const [classTitle, setClassTitle] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [className, setClassName] = useState<string>('Lecture 1')

  const availableClasses = Array.from(
    { length: 3 },
    (_, i) => `Lecture ${i + 1}`
  )

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setClassName(event.target.value)
  }

  useEffect(() => {
    // Fetch API works with: `http://127.0.0.1:8000/classes/info/?className=Lecture%201`
    fetch(
      `http://127.0.0.1:8000/classes/info/?${new URLSearchParams({ className }).toString()}`
    )
      .then((response) => response.json())
      .then((data: ApiResponse) => {
        if (data.error) {
          setError(data.error)
        } else {
          setClassTitle(data.class)
          const fetchedStudents = Object.entries(data.students).map(
            ([name, contributions]): ProcessedStudent => ({
              name,
              contributions: Object.values(contributions as Contribution),
            })
          )
          setStudents(fetchedStudents)

          const firstStudent = Object.values(data.students)[0] || {}
          const fetchedDates = Object.keys(firstStudent)
          setDates(fetchedDates)
        }
      })
      .catch(() => setError('Failed to fetch class data'))
  }, [className])

  const calculateAverage = (contributions: number[]) => {
    const total = contributions.reduce((acc, curr) => acc + curr, 0)
    return (total / contributions.length).toFixed(1)
  }

  const handleCellClick = (row: number, col: number, value: number) => {
    setEditingCell({ row, col })
    setEditValue(value.toFixed(1))
  }

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value)
  }

  const handleEditKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && editingCell) {
      const updatedStudents = [...students]
      const newValue = parseFloat(editValue)
      if (!isNaN(newValue)) {
        updatedStudents[editingCell.row].contributions[editingCell.col] =
          parseFloat(newValue.toFixed(1))
        setStudents(updatedStudents)
      }
      setEditingCell(null)
    }
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!students.length || !dates.length) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Select a Class:</h1>
        <select
          value={className}
          onChange={handleClassChange}
          className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {availableClasses.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Student Name</th>
            {dates.map((date) => (
              <th key={date} className={styles.th}>
                {date}
              </th>
            ))}
            <th className={styles.th}>Average</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, rowIndex) => (
            <tr key={rowIndex} className={styles.tr}>
              <td className={styles.td}>{student.name}</td>
              {student.contributions.map(
                (contribution: number, colIndex: number) => (
                  <td
                    key={colIndex}
                    className={`${styles.td} ${editingCell && editingCell.row === rowIndex && editingCell.col === colIndex ? styles.editing : ''}`}
                    onClick={() =>
                      handleCellClick(rowIndex, colIndex, contribution)
                    }
                  >
                    {editingCell &&
                    editingCell.row === rowIndex &&
                    editingCell.col === colIndex ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={handleEditChange}
                        onKeyPress={handleEditKeyPress}
                        onBlur={() => setEditingCell(null)}
                        className={styles.input}
                      />
                    ) : (
                      contribution.toFixed(1)
                    )}
                  </td>
                )
              )}
              <td className={styles.td}>
                {calculateAverage(student.contributions)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablePage
