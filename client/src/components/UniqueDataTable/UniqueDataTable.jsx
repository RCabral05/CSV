import React, { useState, useEffect } from 'react';
import { useCSVContext } from '../../context/CSVContext';
import { NewList } from './NewList/NewList';

export const UniqueDataTable = () => {
    const { currentData, uploadedCSVs } = useCSVContext();
    const [selectedHeader, setSelectedHeader] = useState('');
    const [selectedImportedHeader, setSelectedImportedHeader] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);
    const [newData, setNewData] = useState([]);

    const headers = currentData && currentData.data.length > 0 ? Object.keys(currentData.data[0]) : [];
    const importedHeaders = selectedTable ? Object.keys(selectedTable.data[0]) : [];

    useEffect(() => {
        if (!selectedHeader || !selectedImportedHeader || !selectedTable) {
            setNewData([]);
            return;
        }

        const uniqueData = [];
        const existingValues = new Set(currentData?.data.map(row => row[selectedHeader]));

        selectedTable.data.forEach(row => {
            if (!existingValues.has(row[selectedImportedHeader])) {
                uniqueData.push(row);
            }
        });

        setNewData(uniqueData.filter((value, index, self) => 
            index === self.findIndex((t) => (
                t[selectedImportedHeader] === value[selectedImportedHeader]
            ))
        ));
    }, [currentData, selectedTable, selectedHeader, selectedImportedHeader]);

    return (
        <div>
            <label htmlFor="headerSelect">Select Current Data Header:</label>
            <select id="headerSelect" value={selectedHeader} onChange={e => setSelectedHeader(e.target.value)}>
                <option value="">-- Select --</option>
                {headers.map((header, index) => (
                    <option key={index} value={header}>{header}</option>
                ))}
            </select>

            <label htmlFor="tableSelect">Select Table:</label>
            <select id="tableSelect" value={selectedTable ? selectedTable.name : ''} onChange={e => setSelectedTable(uploadedCSVs.find(csv => csv.name === e.target.value))}>
                <option value="">-- Select Table --</option>
                {uploadedCSVs.map((csv, index) => (
                    <option key={index} value={csv.name}>{csv.name}</option>
                ))}
            </select>

            {selectedTable && (
                <>
                    <label htmlFor="importedHeaderSelect">Select Imported Data Header:</label>
                    <select id="importedHeaderSelect" value={selectedImportedHeader} onChange={e => setSelectedImportedHeader(e.target.value)}>
                        <option value="">-- Select --</option>
                        {importedHeaders.map((header, index) => (
                            <option key={index} value={header}>{header}</option>
                        ))}
                    </select>
                </>
            )}

            {newData.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                {importedHeaders.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {newData.map((row, index) => (
                                <tr key={index}>
                                    {importedHeaders.map((header, headerIndex) => (
                                        <td key={headerIndex}>{row[header]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <NewList newData={newData}/>                    
                </>
            ) : (
                <p>No new data to display.</p>
            )}
        </div>
    );
};
