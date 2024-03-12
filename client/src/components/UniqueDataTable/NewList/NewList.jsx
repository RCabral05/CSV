import React, { useState, useEffect } from 'react';
import { useCSVContext } from '../../../context/CSVContext';
import './styles.css';

export const NewList = ({ newData }) => {
    const { currentData, exportToCSV } = useCSVContext();
    const [displayedColumns, setDisplayedColumns] = useState([]);
    const [allColumns, setAllColumns] = useState([]);

    useEffect(() => {
        // Extract all unique headers from the combined data
        const combinedData = [...(currentData?.data || []), ...newData];
        const headers = combinedData.reduce((acc, row) => {
            Object.keys(row).forEach(key => {
                if (!acc.includes(key)) {
                    acc.push(key);
                }
            });
            return acc;
        }, []);

        // Update allColumns only if headers are different to prevent infinite loop
        if (JSON.stringify(allColumns) !== JSON.stringify(headers)) {
            setAllColumns(headers);
            setDisplayedColumns(headers); // Initially, select all columns
        }
    }, [currentData, newData, allColumns]); // Include allColumns in dependency array to check for changes

    const toggleColumn = (column) => {
        setDisplayedColumns(prev => {
            if (prev.includes(column)) {
                return prev.filter(c => c !== column); // Remove column
            } else {
                return [...prev, column]; // Add column
            }
        });
    };

    const combinedData = [...(currentData?.data || []), ...newData];

    const handleExport = () => {
        const dataToExport = combinedData.map(row => {
            return displayedColumns.reduce((acc, column) => {
                acc[column] = row[column] ?? '';
                return acc;
            }, {});
        });
        console.log('data export', dataToExport);
        console.log(displayedColumns);
        exportToCSV(dataToExport, displayedColumns);
    };
    return (
        <div>
            {combinedData.length > 0 ? (
                <>
                    <button onClick={handleExport} className="newList-button-export">Export Displayed Data</button>
                    <div className="newList-buttons-container">
                        {allColumns.map(column => (
                            <button
                                key={column}
                                onClick={() => toggleColumn(column)}
                                className={`newList-column-button ${displayedColumns.includes(column) ? 'active' : ''}`}
                            >
                                {column}
                            </button>
                        ))}
                    </div>

                    <div className="newList-table-container">
                        <table className="newList-table">
                            <thead>
                                <tr>
                                    {displayedColumns.map(column => (
                                        <th key={column} className="newList-th">{column}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {combinedData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="newList-tr">
                                        {displayedColumns.map(column => (
                                            <td key={`${rowIndex}-${column}`} className="newList-td">
                                                {row[column] ?? ''}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p>No data to display.</p>
            )}
        </div>
    );
};
