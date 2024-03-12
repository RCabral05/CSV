import React from 'react';
import { useCSVContext } from '../../context/CSVContext';
import './styles.css';

export const CSVTable = () => {
    const { currentData } = useCSVContext();

    const renderTable = (data) => {
        if (!data || data.length === 0) {
            return <p>No data to display.</p>;
        }

        const headers = Object.keys(data[0]);

        return (
            <table className="table">
                <thead>
                    <tr>{headers.map((header, index) => <th key={index}>{header}</th>)}</tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((header, index) => <td key={index}>{row[header] ?? ''}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="currentdata">
            <div className="currentdata-content">
                Current Data
                {currentData ? renderTable(currentData.data) : <p>No data to display.</p>}
            </div>
        </div>
    );
};
