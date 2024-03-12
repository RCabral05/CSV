import React from 'react';
import './styles.css'; 
import { Upload } from '../UploadCSV/UploadCSV';
import { ExportCSV } from '../ExportCSV/ExportCSV';
import { CSVTable } from '../CSVTable/CSVTable';
import { UniqueDataTable } from '../UniqueDataTable/UniqueDataTable';
import { UploadCSVViewer } from '../UploadCSVViewer/UploadCSVViewer';
export const Index = () => {



    return (
      <div className="index">
        <Upload />
        <UploadCSVViewer />
        <CSVTable />
        Imported Data
        <UniqueDataTable />
      </div>
    );
};
