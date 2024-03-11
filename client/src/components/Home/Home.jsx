import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import './styles.css'; // Ensure you have this CSS file for styling

export const Home = () => {
  const [currentData, setCurrentData] = useState(null);
  const [uploadedCSVs, setUploadedCSVs] = useState([]);
  const [activeTab, setActiveTab] = useState('');

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
        setActiveTab("Current Data");
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

  const renderUniqueTable = (data, compareData = []) => {
    if (!data || data.length === 0) {
      return <p>No unique data to display.</p>;
    }
  
    const headers = Object.keys(data[0]);
    const uniqueData = [];
  
    data.forEach(row => {
      const rowString = JSON.stringify(row);
      if (
        !uniqueData.some(item => JSON.stringify(item) === rowString) &&
        !compareData.some(item => JSON.stringify(item) === rowString) &&
        Object.values(row).every(value => value != null && value.toString().trim() !== '')
      ) {
        uniqueData.push(row);
      }
    });
  
    return (
      <table className="table">
        <thead>
          <tr>{headers.map((header, index) => <th key={index}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {uniqueData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, index) => <td key={index}>{row[header] ?? ''}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
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
  

  const exportToCSV = (data) => {
    const filteredData = filterData(data);
  
    if (filteredData.length === 0) {
      alert("No data to export.");
      return;
    }
  
    const filename = prompt("Enter filename (without extension):");
    if (!filename) return; // If user cancels or leaves it empty, exit
  
    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  
  

  return (
    <div className="layout">
      <div className="button-container">
        <input type="file" accept=".csv" onChange={handleFileChange1} />
        <input type="file" accept=".csv" onChange={handleFileChange2} multiple />
      </div>
      <div className="tabs">
        <button className={activeTab === "Current Data" ? 'active' : ''} onClick={() => setActiveTab("Current Data")}>
          Current Data
        </button>
        <button className={activeTab === "New Data" ? 'active' : ''} onClick={() => setActiveTab("New Data")}>
          New Data
        </button>
        <button className={activeTab === "New List" ? 'active' : ''} onClick={() => setActiveTab("New List")}>
          New List
        </button>
        {uploadedCSVs.map(csv => (
          <div key={csv.name} className="tab">
            <button className={activeTab === csv.name ? 'active' : ''} onClick={() => setActiveTab(csv.name)}>
              {csv.name}
            </button>
            <button onClick={() => removeCSV(csv.name)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="data-display">
        {activeTab === "Current Data" && currentData ? renderTable(currentData.data) : null}
        {activeTab === "New Data" ? renderUniqueTable(uploadedCSVs.flatMap(csv => csv.data), currentData?.data) : null}
        {activeTab === "New List" && currentData ? renderUniqueTable([...currentData.data, ...uploadedCSVs.flatMap(csv => csv.data)]) : null}
        {uploadedCSVs.filter(csv => csv.name === activeTab).map(csv => renderTable(csv.data))}
      </div>
      {activeTab === "New List" && (
       <button onClick={() => exportToCSV([...currentData.data, ...uploadedCSVs.flatMap(csv => csv.data)], 'new_list.csv')}>
          Export New List
       </button>
     
      )}
    </div>
  );
};
