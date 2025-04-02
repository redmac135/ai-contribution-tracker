"use client";

import { useState } from 'react';
import styles from './page.module.css';

const initialStudents = [
    { name: 'Student 1', contributions: [8.0, 7.0, 9.0, 6.0] },
    { name: 'Student 2', contributions: [6.0, 8.0, 7.0, 9.0] },
    { name: 'Student 3', contributions: [9.0, 6.0, 8.0, 7.0] },
    { name: 'Student 4', contributions: [7.0, 9.0, 6.0, 8.0] },
    { name: 'Student 5', contributions: [8.0, 7.0, 9.0, 6.0] },
];

const dates = ['2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'];

const TablePage = () => {
    const [students, setStudents] = useState(initialStudents);
    const [newStudentName, setNewStudentName] = useState('');
    const [editingCell, setEditingCell] = useState<{ row: number, col: number } | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleAddStudent = () => {
        if (newStudentName.trim() !== '') {
            setStudents([...students, { name: newStudentName, contributions: [0.0, 0.0, 0.0, 0.0] }]);
            setNewStudentName('');
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAddStudent();
        }
    };

    const calculateAverage = (contributions: number[]) => {
        const total = contributions.reduce((acc, curr) => acc + curr, 0);
        return (total / contributions.length).toFixed(1);
    };

    const handleCellClick = (row: number, col: number, value: number) => {
        setEditingCell({ row, col });
        setEditValue(value.toFixed(1));
    };

    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(event.target.value);
    };

    const handleEditKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && editingCell) {
            const updatedStudents = [...students];
            const newValue = parseFloat(editValue);
            if (!isNaN(newValue)) {
                updatedStudents[editingCell.row].contributions[editingCell.col] = parseFloat(newValue.toFixed(1));
                setStudents(updatedStudents);
            }
            setEditingCell(null);
        }
    };

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Student Name</th>
                        {dates.map(date => (
                            <th key={date} className={styles.th}>{date}</th>
                        ))}
                        <th className={styles.th}>Average</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, rowIndex) => (
                        <tr key={rowIndex} className={styles.tr}>
                            <td className={styles.td}>{student.name}</td>
                            {student.contributions.map((contribution, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`${styles.td} ${editingCell && editingCell.row === rowIndex && editingCell.col === colIndex ? styles.editing : ''}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex, contribution)}
                                >
                                    {editingCell && editingCell.row === rowIndex && editingCell.col === colIndex ? (
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={handleEditChange}
                                            onKeyPress={handleEditKeyPress}
                                            onBlur={() => setEditingCell(null)}
                                            autoFocus
                                            className={styles.input}
                                        />
                                    ) : (
                                        contribution.toFixed(1)
                                    )}
                                </td>
                            ))}
                            <td className={styles.td}>{calculateAverage(student.contributions)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter student name"
                    className={styles.input}
                />
                <button onClick={handleAddStudent} className={styles.button}>Add Student</button>
            </div>
        </div>
    );
};

export default TablePage;
