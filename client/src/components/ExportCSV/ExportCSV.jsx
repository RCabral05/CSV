import React, { useState } from 'react';
import { useCSVContext } from '../../context/CSVContext';

export const ExportCSV = () => {
    const { currentData, uploadedCSVs, exportToCSV } = useCSVContext();
    const [exportType, setExportType] = useState('current');

    const handleExport = () => {
        let dataToExport = [];
        if (exportType === 'current' && currentData) {
            dataToExport = currentData.data;
        } else if (exportType === 'uploaded' && uploadedCSVs.length > 0) {
            // Merge all uploaded CSV data
            dataToExport = uploadedCSVs.reduce((acc, csv) => [...acc, ...csv.data], []);
        }

        if (dataToExport.length > 0) {
            exportToCSV(dataToExport);
        } else {
            alert('No data to export.');
        }
    };

    return (
        <div>
            <label>
                Export:
                <select value={exportType} onChange={e => setExportType(e.target.value)}>
                    <option value="current">Current Data</option>
                    <option value="uploaded">Uploaded CSVs</option>
                </select>
            </label>
            <button onClick={handleExport}>Export CSV</button>
        </div>
    );
};
