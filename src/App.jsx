import { useState, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const employees = [
  { id: 1, firstName: "John", lastName: "Smith", email: "john.smith@company.com", department: "Engineering", position: "Senior Developer", salary: 95000, hireDate: "2021-03-15", age: 32, location: "New York", performanceRating: 4.2, projectsCompleted: 12, isActive: true, skills: ["JavaScript", "React", "Node.js"], manager: "Sarah Johnson" },
  { id: 2, firstName: "Emily", lastName: "Davis", email: "emily.davis@company.com", department: "Marketing", position: "Marketing Manager", salary: 78000, hireDate: "2020-07-22", age: 29, location: "Los Angeles", performanceRating: 4.5, projectsCompleted: 8, isActive: true, skills: ["Digital Marketing", "SEO", "Analytics"], manager: "Michael Brown" },
  { id: 3, firstName: "Michael", lastName: "Brown", email: "michael.brown@company.com", department: "Marketing", position: "VP Marketing", salary: 125000, hireDate: "2019-01-10", age: 38, location: "Los Angeles", performanceRating: 4.7, projectsCompleted: 15, isActive: true, skills: ["Strategy", "Leadership", "Brand Management"], manager: null },
  { id: 4, firstName: "Sarah", lastName: "Johnson", email: "sarah.johnson@company.com", department: "Engineering", position: "Engineering Manager", salary: 115000, hireDate: "2018-11-05", age: 35, location: "New York", performanceRating: 4.6, projectsCompleted: 18, isActive: true, skills: ["Team Leadership", "Architecture", "Python"], manager: "David Wilson" },
  { id: 5, firstName: "David", lastName: "Wilson", email: "david.wilson@company.com", department: "Engineering", position: "CTO", salary: 180000, hireDate: "2017-05-12", age: 42, location: "New York", performanceRating: 4.8, projectsCompleted: 25, isActive: true, skills: ["Technical Strategy", "Leadership", "Cloud Architecture"], manager: null },
  { id: 6, firstName: "Lisa", lastName: "Garcia", email: "lisa.garcia@company.com", department: "Sales", position: "Sales Representative", salary: 65000, hireDate: "2022-02-28", age: 26, location: "Chicago", performanceRating: 3.9, projectsCompleted: 6, isActive: true, skills: ["CRM", "Negotiation", "Customer Relations"], manager: "Robert Martinez" },
  { id: 7, firstName: "Robert", lastName: "Martinez", email: "robert.martinez@company.com", department: "Sales", position: "Sales Manager", salary: 92000, hireDate: "2020-09-14", age: 34, location: "Chicago", performanceRating: 4.3, projectsCompleted: 11, isActive: true, skills: ["Sales Strategy", "Team Management", "B2B Sales"], manager: "Jennifer Lee" },
  { id: 8, firstName: "Jennifer", lastName: "Lee", email: "jennifer.lee@company.com", department: "Sales", position: "VP Sales", salary: 135000, hireDate: "2019-06-18", age: 40, location: "Chicago", performanceRating: 4.6, projectsCompleted: 16, isActive: true, skills: ["Strategic Sales", "Leadership", "Market Analysis"], manager: null },
  { id: 9, firstName: "James", lastName: "Anderson", email: "james.anderson@company.com", department: "HR", position: "HR Specialist", salary: 58000, hireDate: "2021-08-30", age: 28, location: "Austin", performanceRating: 4.0, projectsCompleted: 7, isActive: true, skills: ["Recruitment", "Employee Relations", "HRIS"], manager: "Karen White" },
  { id: 10, firstName: "Karen", lastName: "White", email: "karen.white@company.com", department: "HR", position: "HR Manager", salary: 85000, hireDate: "2019-12-02", age: 36, location: "Austin", performanceRating: 4.4, projectsCompleted: 13, isActive: true, skills: ["HR Strategy", "Policy Development", "Leadership"], manager: null },
  { id: 11, firstName: "Alex", lastName: "Thompson", email: "alex.thompson@company.com", department: "Engineering", position: "Junior Developer", salary: 72000, hireDate: "2023-01-16", age: 24, location: "New York", performanceRating: 3.8, projectsCompleted: 4, isActive: true, skills: ["Java", "Spring Boot", "MySQL"], manager: "Sarah Johnson" },
  { id: 12, firstName: "Maria", lastName: "Rodriguez", email: "maria.rodriguez@company.com", department: "Finance", position: "Financial Analyst", salary: 68000, hireDate: "2021-11-08", age: 30, location: "Miami", performanceRating: 4.1, projectsCompleted: 9, isActive: true, skills: ["Financial Modeling", "Excel", "SAP"], manager: "Thomas Clark" },
  { id: 13, firstName: "Thomas", lastName: "Clark", email: "thomas.clark@company.com", department: "Finance", position: "Finance Manager", salary: 98000, hireDate: "2018-04-25", age: 37, location: "Miami", performanceRating: 4.5, projectsCompleted: 14, isActive: true, skills: ["Financial Planning", "Budget Management", "Leadership"], manager: null },
  { id: 14, firstName: "Amanda", lastName: "Taylor", email: "amanda.taylor@company.com", department: "Marketing", position: "Content Specialist", salary: 55000, hireDate: "2022-06-12", age: 25, location: "Los Angeles", performanceRating: 3.7, projectsCompleted: 5, isActive: true, skills: ["Content Writing", "Social Media", "Adobe Creative"], manager: "Michael Brown" },
  { id: 15, firstName: "Ryan", lastName: "Miller", email: "ryan.miller@company.com", department: "Engineering", position: "DevOps Engineer", salary: 88000, hireDate: "2020-10-19", age: 31, location: "Seattle", performanceRating: 4.3, projectsCompleted: 10, isActive: true, skills: ["AWS", "Docker", "Kubernetes"], manager: "Sarah Johnson" },
  { id: 16, firstName: "Jessica", lastName: "Moore", email: "jessica.moore@company.com", department: "Sales", position: "Account Executive", salary: 75000, hireDate: "2021-04-03", age: 27, location: "Denver", performanceRating: 4.0, projectsCompleted: 8, isActive: false, skills: ["Account Management", "Salesforce", "Presentation"], manager: "Robert Martinez" },
  { id: 17, firstName: "Daniel", lastName: "Harris", email: "daniel.harris@company.com", department: "Finance", position: "Senior Accountant", salary: 73000, hireDate: "2019-08-14", age: 33, location: "Miami", performanceRating: 4.2, projectsCompleted: 12, isActive: true, skills: ["Accounting", "Tax Preparation", "QuickBooks"], manager: "Thomas Clark" },
  { id: 18, firstName: "Nicole", lastName: "Jackson", email: "nicole.jackson@company.com", department: "HR", position: "Recruiter", salary: 62000, hireDate: "2022-09-05", age: 29, location: "Austin", performanceRating: 3.9, projectsCompleted: 6, isActive: true, skills: ["Talent Acquisition", "LinkedIn Recruiter", "Interviewing"], manager: "Karen White" },
  { id: 19, firstName: "Kevin", lastName: "Wright", email: "kevin.wright@company.com", department: "Engineering", position: "QA Engineer", salary: 76000, hireDate: "2020-12-07", age: 30, location: "Seattle", performanceRating: 4.1, projectsCompleted: 11, isActive: true, skills: ["Test Automation", "Selenium", "API Testing"], manager: "Sarah Johnson" },
  { id: 20, firstName: "Stephanie", lastName: "Lopez", email: "stephanie.lopez@company.com", department: "Marketing", position: "Digital Marketing Specialist", salary: 64000, hireDate: "2021-12-20", age: 26, location: "Phoenix", performanceRating: 3.8, projectsCompleted: 7, isActive: true, skills: ["Google Ads", "Facebook Ads", "Email Marketing"], manager: "Michael Brown" },
];

const deptColor = {
  Engineering: "#2563EB", // blue
  Marketing: "#EC4899",   // pink
  Sales: "#10B981",       // emerald
  HR: "#F59E0B",          // amber
  Finance: "#8B5CF6",     // violet
};

function NameRenderer({ data }) {
  const full = `${data.firstName} ${data.lastName}`;
  const initials = `${data.firstName[0]}${data.lastName[0]}`.toUpperCase();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "#fff", fontSize: 11, fontWeight: 700 }}>
        {initials}
      </span>
      <span style={{ fontWeight: 600 }}>{full}</span>
    </div>
  );
}
function SalaryRenderer({ value }) {
  return <span style={{ fontWeight: 700 }}>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)}</span>;
}
function ActiveRenderer({ value }) {
  const ok = !!value;
  return <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`, background: ok ? "#f0fdf4" : "#fef2f2", color: ok ? "#166534" : "#991b1b" }}>{ok ? "Active" : "Inactive"}</span>;
}
function DepartmentRenderer({ value }) {
  const c = deptColor[value] || "#64748b";
  return <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: `${c}1A`, color: c, border: `1px solid ${c}33` }}>{value}</span>;
}
function RatingRenderer({ value }) {
  const v = Number(value || 0);
  const stars = "★".repeat(Math.round(v)) + "☆".repeat(5 - Math.round(v));
  return <span style={{ color: "#f59e0b", fontWeight: 600 }}>{stars} <span style={{ color: "#6b7280" }}>({v.toFixed(1)})</span></span>;
}
function DateRenderer({ value }) {
  return <span style={{ color: "#6b7280" }}>{new Date(`${value}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>;
}

export default function App() {
  const gridRef = useRef();
  const [quickFilter, setQuickFilter] = useState("");
  const [rowCount, setRowCount] = useState(employees.length);

  const stats = useMemo(() => {
    const totalPayroll = employees.reduce((s, e) => s + e.salary, 0);
    const active = employees.filter((e) => e.isActive).length;
    const avg = employees.reduce((s, e) => s + e.performanceRating, 0) / employees.length;
    return { totalPayroll, active, avg, count: employees.length };
  }, []);

  const columnDefs = useMemo(() => [
    { field: "id", width: 90, pinned: "left" },
    { headerName: "Name", minWidth: 220, cellRenderer: NameRenderer, filter: "agTextColumnFilter" },
    { field: "email", minWidth: 240 },
    { field: "department", width: 140, cellRenderer: DepartmentRenderer },
    { field: "position", minWidth: 180 },
    { field: "salary", width: 140, cellRenderer: SalaryRenderer, filter: "agNumberColumnFilter", type: "numericColumn" },
    { field: "hireDate", headerName: "Hire Date", width: 140, cellRenderer: DateRenderer, filter: "agDateColumnFilter" },
    { field: "age", width: 90, filter: "agNumberColumnFilter" },
    { field: "location", width: 120 },
    { field: "performanceRating", headerName: "Rating", minWidth: 170, cellRenderer: RatingRenderer, filter: "agNumberColumnFilter" },
    { field: "projectsCompleted", headerName: "Projects", width: 110, filter: "agNumberColumnFilter" },
    { field: "isActive", headerName: "Status", width: 120, cellRenderer: ActiveRenderer },
    { field: "manager", width: 170, valueFormatter: (p) => p.value || "—" },
    { field: "skills", minWidth: 220, valueFormatter: (p) => (p.value || []).join(", ") },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,
  }), []);

  const onFilterChanged = useCallback(() => {
    if (gridRef.current?.api) setRowCount(gridRef.current.api.getDisplayedRowCount());
  }, []);

  const onQuickFilter = useCallback((e) => {
    const v = e.target.value;
    setQuickFilter(v);
    gridRef.current?.api?.setGridOption("quickFilterText", v);
    setTimeout(() => {
      if (gridRef.current?.api) setRowCount(gridRef.current.api.getDisplayedRowCount());
    }, 30);
  }, []);

  const onExport = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({ fileName: "employees-dashboard.csv" });
  }, []);

  const onReset = useCallback(() => {
    gridRef.current?.api?.setFilterModel(null);
    gridRef.current?.api?.setGridOption("quickFilterText", "");
    setQuickFilter("");
    setRowCount(employees.length);
  }, []);

  const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const kpiCards = [
    { label: "Total Payroll", value: currency.format(stats.totalPayroll), grad: "linear-gradient(135deg,#0EA5E9,#2563EB)" },
    { label: "Active Employees", value: stats.active, grad: "linear-gradient(135deg,#10B981,#059669)" },
    { label: "Avg Performance", value: stats.avg.toFixed(2), grad: "linear-gradient(135deg,#F59E0B,#F97316)" },
    { label: "Employees", value: stats.count, grad: "linear-gradient(135deg,#8B5CF6,#7C3AED)" },
  ];

  return (
    <>
      <style>{`
        body, #root {
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(160deg, #F8FAFC 0%, #EEF2FF 45%, #ECFEFF 100%);
        }

        .app {
          padding: 24px 28px;
          font-family: Inter, Segoe UI, Arial, sans-serif;
          color: #0F172A;
        }

        .title {
          margin-top: 0;
          margin-bottom: 14px;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #1E1B4B;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 16px;
        }

        .card {
          color: #fff;
          border-radius: 14px;
          padding: 14px 16px;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.12);
          transition: transform .15s ease;
        }
        .card:hover { transform: translateY(-2px); }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; opacity: .9; margin-bottom: 6px; }
        .value { font-size: 24px; font-weight: 800; }

        .toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FFFFFF;
          border: 1px solid #DDE5F5;
          border-bottom: none;
          border-radius: 12px 12px 0 0;
          padding: 10px;
        }
        .input {
          height: 38px;
          min-width: 280px;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          padding: 0 12px;
          outline: none;
        }
        .input:focus {
          border-color: #6366F1;
          box-shadow: 0 0 0 3px rgba(99,102,241,.16);
        }

        .btn {
          height: 38px;
          border: 0;
          border-radius: 10px;
          padding: 0 14px;
          cursor: pointer;
          font-weight: 700;
          color: #fff;
        }
        .btn.reset { background: linear-gradient(135deg,#FB7185,#F43F5E); }
        .btn.dark { background: linear-gradient(135deg,#4F46E5,#7C3AED); }

        .ag-theme-quartz {
          --ag-font-family: Inter, Segoe UI, Arial, sans-serif;
          --ag-font-size: 13px;
          --ag-row-height: 48px; 
          --ag-header-height: 44px; 
          --ag-floating-filter-height: 34px; 
          --ag-border-color: #DDE5F5;
          --ag-header-background-color: #EEF2FF;
          --ag-odd-row-background-color: #F8FAFC;
          --ag-row-hover-color: #E0E7FF;
          --ag-selected-row-background-color: #DDD6FE;
          --ag-accent-color: #6366F1;
        }

        .ag-theme-quartz .ag-root-wrapper {
          border: 1px solid #DDE5F5;
          border-top: none;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
          box-shadow: 0 10px 24px rgba(79,70,229,.12);
        }

        .ag-theme-quartz .ag-header-cell-label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #312E81;
        }
      `}</style>

      <div className="app">
        <h1 className="title">Employee Dashboard</h1>

        <div className="cards">
          {kpiCards.map((card) => (
            <div className="card" style={{ background: card.grad }} key={card.label}>
              <div className="label">{card.label}</div>
              <div className="value">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <input className="input" value={quickFilter} onChange={onQuickFilter} placeholder="Quick search..." />
          <button className="btn reset" onClick={onReset}>Reset Filters</button>
          <button className="btn dark" onClick={onExport}>Export CSV</button>
          <div style={{ marginLeft: "auto", color: "#334155", fontSize: 12, fontWeight: 600 }}>{rowCount} / {stats.count} rows</div>
        </div>

        <div className="ag-theme-quartz" style={{ height: 350, width: "100%" }}>
          <AgGridReact
            ref={gridRef}
            rowData={employees}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20]}
            animateRows
            rowSelection={{ mode: "multiRow" }}
            onFilterChanged={onFilterChanged}
            enableCellTextSelection
          />
        </div>
      </div>
    </>
  );
}