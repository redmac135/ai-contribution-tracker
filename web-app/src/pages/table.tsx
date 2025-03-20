import React, { useState } from 'react';
import styles from './table.module.css';

const initialStudents = [
    { name: 'Student 1', contributions: [8, 7, 9, 6] },
    { name: 'Student 2', contributions: [6, 8, 7, 9] },
    { name: 'Student 3', contributions: [9, 6, 8, 7] },
    { name: 'Student 4', contributions: [7, 9, 6, 8] },
    { name: 'Student 5', contributions: [8, 7, 9, 6] },
];

const dates = ['2025-03-16', '2025-03-17', '2025-03-18', '2025-03-19'];

function TablePage() {
    const [students, setStudents] = useState(initialStudents);
    const [newStudentName, setNewStudentName] = useState('');
    const [editingCell, setEditingCell] = useState<{ row: number, col: number } | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleAddStudent = () => {
        if (newStudentName.trim() !== '') {
            setStudents([...students, { name: newStudentName, contributions: [0, 0, 0, 0] }]);
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
        return (total / contributions.length).toFixed(2);
    };

    const handleCellClick = (row: number, col: number, value: number) => {
        setEditingCell({ row, col });
        setEditValue(value.toString());
    };

    const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(event.target.value);
    };

    const handleEditKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && editingCell) {
            const updatedStudents = [...students];
            const newValue = parseInt(editValue, 10);
            if (!isNaN(newValue)) {
                updatedStudents[editingCell.row].contributions[editingCell.col] = newValue;
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
                                <td key={colIndex} className={styles.td} onClick={() => handleCellClick(rowIndex, colIndex, contribution)}>
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
                                        contribution
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
}

export default TablePage;