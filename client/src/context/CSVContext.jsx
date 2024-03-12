import React, { createContext, useContext, useState, useCallback } from 'react';
import Papa from 'papaparse';

const CSVContext = createContext();

export const useCSVContext = () => useContext(CSVContext);

export const CSVProvider = ({ children }) => {
    const [currentData, setCurrentData] = useState(null);
    const [uploadedCSVs, setUploadedCSVs] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    console.log('current data', currentData);
    console.log('uploaded data', uploadedCSVs);

    const parseCSV = (file, callback) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: result => {
            callback(result.data, file.name);
          },
        });
    };

    const handleFileChange1 = event => {
        const file = event.target.files[0];
        if (file) {
          parseCSV(file, (data, name) => {
            setCurrentData({ name: "Current Data", data });
          });
        }
    };
    
    const handleFileChange2 = event => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
          if (file) {
            parseCSV(file, (data, name) => {
              setUploadedCSVs(prev => [...prev, { name, data }]);
            });
          }
        });
        // Reset the value of the file input to clear the selected file(s)
        event.target.value = null;
    };

    const removeCSV = name => {
        setUploadedCSVs(prev => prev.filter(csv => csv.name !== name));
        if (activeTab === name) {
          setActiveTab("Current Data");
        }
    };
    
    const filterData = (data) => {
        const filteredData = [];
      
        data.forEach(row => {
          const rowString = JSON.stringify(row);
          if (!filteredData.some(item => JSON.stringify(item) === rowString) &&
              Object.values(row).every(value => value != null && value.toString().trim() !== '')) {
            filteredData.push(row);
          }
        });
      
        return filteredData;
      };
      
    
      // Inside CSVProvider component

      const exportToCSV = (data, columns) => {
        if (!data || data.length === 0) {
            alert("No data to export.");
            return;
        }
    
        // Optionally, you can apply additional data filtering here
        const filteredData = data;
    
        // Construct the CSV content
        const headers = columns.join(',');
        const rows = filteredData.map(row => 
            columns.map(column => 
                row.hasOwnProperty(column) ? `"${row[column]}"` : ''
            ).join(',')
        );
    
        // Combine headers and rows
        const csvContent = [headers, ...rows].join('\n');
    
        // Prompt for filename and create Blob for download
        const filename = prompt("Enter filename (without extension):");
        if (!filename) return;
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    


    return (
        <CSVContext.Provider value={{ 
            currentData, 
            uploadedCSVs, 
            activeTab,
            exportToCSV,
            handleFileChange1, 
            handleFileChange2,
            removeCSV, 
        }}>
            {children}
        </CSVContext.Provider>
    );
};
