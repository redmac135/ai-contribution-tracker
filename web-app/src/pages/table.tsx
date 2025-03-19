import React, { useState } from 'react';
import './table.css';

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

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        {dates.map(date => (
                            <th key={date}>{date}</th>
                        ))}
                        <th>Average</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={index}>
                            <td>{student.name}</td>
                            {student.contributions.map((contribution, idx) => (
                                <td key={idx}>{contribution}</td>
                            ))}
                            <td>{calculateAverage(student.contributions)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter student name"
                />
                <button onClick={handleAddStudent}>Add Student</button>
            </div>
        </div>
    );
}

export default TablePage;