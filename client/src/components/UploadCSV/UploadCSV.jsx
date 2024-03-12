import React from 'react';
import { useCSVContext } from '../../context/CSVContext';
import './styles.css';

export const Upload = () => {
    const { handleFileChange1, handleFileChange2 } = useCSVContext();

    return (
        <div className="Upload">
            <div className="upload-content">
                <div className="first-button">
                    <label>
                        Import current list
                    </label>
                    <input type="file" accept=".csv" onChange={handleFileChange1} />
                </div>
                <div className="second-button">
                    <label>
                        Import new data
                    </label>
                    <input type="file" accept=".csv" onChange={handleFileChange2} multiple />
                </div>
            </div>
        </div>
    );
};
