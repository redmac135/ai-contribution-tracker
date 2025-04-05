"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

const TablePage = ({ className }: { className: string }) => {
    const [students, setStudents] = useState<any[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [classTitle, setClassTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        // Fetch class data from the API
        fetch(`/api/info/?className=${className}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch class data");
                }
                return response.json();
            })
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setClassTitle(data.class);
                    const fetchedStudents = Object.entries(data.students).map(([name, contributions]) => ({
                        name,
                        contributions: Object.values(contributions),
                    }));
                    setStudents(fetchedStudents);

                    const fetchedDates = Object.keys(data.students[Object.keys(data.students)[0]] || {});
                    setDates(fetchedDates);
                }
            })
            .catch(() => setError("Failed to fetch class data"));
    }, [className]);

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
        if (event.key === "Enter" && editingCell) {
            const updatedStudents = [...students];
            const newValue = parseFloat(editValue);
            if (!isNaN(newValue)) {
                updatedStudents[editingCell.row].contributions[editingCell.col] = parseFloat(newValue.toFixed(1));
                setStudents(updatedStudents);
            }
            setEditingCell(null);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!students.length || !dates.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Class: {classTitle}</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Student Name</th>
                        {dates.map((date) => (
                            <th key={date} className={styles.th}>{date}</th>
                        ))}
                        <th className={styles.th}>Average</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, rowIndex) => (
                        <tr key={rowIndex} className={styles.tr}>
                            <td className={styles.td}>{student.name}</td>
                            {student.contributions.map((contribution: number, colIndex: number) => (
                                <td
                                    key={colIndex}
                                    className={`${styles.td} ${editingCell && editingCell.row === rowIndex && editingCell.col === colIndex ? styles.editing : ""}`}
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
        </div>
    );
};

export default TablePage;
