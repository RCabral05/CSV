import React, { useState } from 'react';
import { useCSVContext } from '../../context/CSVContext'; // Adjust the import path according to your file structure
import './styles.css';

export const UploadCSVViewer = () => {
    const { uploadedCSVs, removeCSV } = useCSVContext();
    const [selectedCSV, setSelectedCSV] = useState(null);

    const handleSelectCSV = (csv) => {
        setSelectedCSV(csv);
    };

    const handleCloseSelectedCSV = () => {
        setSelectedCSV(null);
    };

    return (
        <div className='view-csv'>
            <div className="view-csv-content">
                <h3>Uploaded CSV Files:</h3>
                <ul>
                    {uploadedCSVs.map(csv => (
                        <li key={csv.name}>
                            {csv.name}
                            <button onClick={() => handleSelectCSV(csv)}>View Data</button>
                            <button onClick={() => removeCSV(csv.name)}>Remove</button>
                        </li>
                    ))}
                </ul>

                {selectedCSV && (
                    <div>
                        <h4>Data in: {selectedCSV.name}</h4>
                        <button onClick={handleCloseSelectedCSV}>Close</button>
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(selectedCSV.data[0]).map(header => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCSV.data.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((value, idx) => (
                                            <td key={idx}>{value}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

