import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import employees from "../data/employees";

// Register AG Grid community modules once
ModuleRegistry.registerModules([AllCommunityModule]);

const EmployeeGrid = () => {
  const columnDefs = [
    { field: "id", headerName: "ID", sortable: true, filter: true },
    { field: "firstName", headerName: "First Name", sortable: true, filter: true },
    { field: "lastName", headerName: "Last Name", sortable: true, filter: true },
    { field: "email", headerName: "Email", sortable: true, filter: true },
    { field: "department", headerName: "Department", sortable: true, filter: true },
    { field: "position", headerName: "Position", sortable: true, filter: true },
    { field: "salary", headerName: "Salary", sortable: true, filter: true },
    { field: "hireDate", headerName: "Hire Date", sortable: true, filter: true },
    { field: "age", headerName: "Age", sortable: true, filter: true },
    { field: "location", headerName: "Location", sortable: true, filter: true },
    { field: "performanceRating", headerName: "Performance Rating", sortable: true, filter: true },
    { field: "projectsCompleted", headerName: "Projects Completed", sortable: true, filter: true },
    { field: "isActive", headerName: "Active", sortable: true, filter: true },
    { field: "skills", headerName: "Skills", sortable: true, filter: true },
    { field: "manager", headerName: "Manager", sortable: true, filter: true },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={employees}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        animateRows={true}
      />
    </div>
  );
};

export default EmployeeGrid;