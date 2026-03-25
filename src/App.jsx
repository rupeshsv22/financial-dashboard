import { useState, useRef, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

// register AG Grid community modules once
ModuleRegistry.registerModules([AllCommunityModule]);

const transactions = [
  { id: "TXN-001", date: "2024-03-01", description: "AWS Cloud Services",        category: "Infrastructure", amount: -4820.50,  status: "Settled", account: "Operations",  merchant: "Amazon Web Services" },
  { id: "TXN-002", date: "2024-03-02", description: "Client Payment – Orion Corp",category: "Revenue",       amount: 28500.00,  status: "Settled", account: "Receivables", merchant: "Orion Corporation" },
  { id: "TXN-003", date: "2024-03-03", description: "Office Lease – March",       category: "Facilities",    amount: -6200.00,  status: "Settled", account: "Operations",  merchant: "Meridian Properties" },
  { id: "TXN-004", date: "2024-03-04", description: "Payroll Processing Fee",     category: "HR & Payroll",  amount: -340.00,   status: "Settled", account: "Payroll",     merchant: "ADP" },
  { id: "TXN-005", date: "2024-03-05", description: "Software Licenses – Adobe",  category: "Software",      amount: -1240.00,  status: "Settled", account: "Operations",  merchant: "Adobe Systems" },
  { id: "TXN-006", date: "2024-03-06", description: "Client Payment – Bluewave",  category: "Revenue",       amount: 15750.00,  status: "Pending", account: "Receivables", merchant: "Bluewave Technologies" },
  { id: "TXN-007", date: "2024-03-07", description: "Travel – SFO Conference",    category: "Travel",        amount: -2190.00,  status: "Settled", account: "Expenses",    merchant: "Amex Corporate" },
  { id: "TXN-008", date: "2024-03-08", description: "Digital Marketing – Google", category: "Marketing",     amount: -3600.00,  status: "Settled", account: "Marketing",   merchant: "Google LLC" },
  { id: "TXN-009", date: "2024-03-10", description: "Equipment Purchase – Monitors",category:"Equipment",    amount: -5400.00,  status: "Settled", account: "CapEx",       merchant: "Dell Technologies" },
  { id: "TXN-010", date: "2024-03-11", description: "Client Retainer – NovaStar", category: "Revenue",       amount: 9800.00,   status: "Settled", account: "Receivables", merchant: "NovaStar Media" },
  { id: "TXN-011", date: "2024-03-12", description: "Insurance Premium – Q1",     category: "Insurance",     amount: -2850.00,  status: "Settled", account: "Operations",  merchant: "Chubb Group" },
  { id: "TXN-012", date: "2024-03-13", description: "Contractor Invoice – Dev",   category: "Contractors",   amount: -8500.00,  status: "Pending", account: "Payroll",     merchant: "Freelancer Portal" },
  { id: "TXN-013", date: "2024-03-14", description: "Client Payment – Helios",    category: "Revenue",       amount: 42000.00,  status: "Settled", account: "Receivables", merchant: "Helios Ventures" },
  { id: "TXN-014", date: "2024-03-15", description: "Utilities – March",          category: "Facilities",    amount: -980.00,   status: "Settled", account: "Operations",  merchant: "Pacific Gas & Electric" },
  { id: "TXN-015", date: "2024-03-18", description: "Slack – Team Plan",          category: "Software",      amount: -420.00,   status: "Settled", account: "Operations",  merchant: "Slack Technologies" },
  { id: "TXN-016", date: "2024-03-19", description: "Client Payment – Apex",      category: "Revenue",       amount: 19200.00,  status: "Failed",  account: "Receivables", merchant: "Apex Financial" },
  { id: "TXN-017", date: "2024-03-20", description: "Business Meals – Q1 Team",  category: "Meals & Ent.",  amount: -1560.00,  status: "Settled", account: "Expenses",    merchant: "Expensify" },
  { id: "TXN-018", date: "2024-03-21", description: "Legal Retainer – March",     category: "Legal",         amount: -4500.00,  status: "Settled", account: "Operations",  merchant: "Morrison & Foerster" },
  { id: "TXN-019", date: "2024-03-25", description: "Client Bonus – Quarterly",   category: "Revenue",       amount: 5500.00,   status: "Pending", account: "Receivables", merchant: "Internal Transfer" },
  { id: "TXN-020", date: "2024-03-28", description: "R&D Subscription – GitHub",  category: "Software",      amount: -840.00,   status: "Settled", account: "Engineering", merchant: "GitHub Inc." },
];

const STATUS_CONFIG = {
  Settled: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  Pending: { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Failed:  { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const CATEGORY_COLORS = {
  Revenue:       "#16a34a",
  Infrastructure:"#2563eb",
  Software:      "#7c3aed",
  Facilities:    "#ea580c",
  "HR & Payroll":"#9333ea",
  Travel:        "#0891b2",
  Marketing:     "#db2777",
  Equipment:     "#64748b",
  Insurance:     "#ca8a04",
  Contractors:   "#c2410c",
  Legal:         "#1e40af",
  "Meals & Ent.":"#b45309",
};

// ── Custom Cell Renderers ──────────────────────────────────────────────

function AmountRenderer({ value }) {
  const isCredit = value > 0;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2,
  }).format(Math.abs(value));
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontWeight: 600,
      fontSize: 13,
      color: isCredit ? "#16a34a" : "#dc2626",
      letterSpacing: "-0.01em",
    }}>
      {isCredit ? "+" : "−"}{formatted}
    </span>
  );
}

function StatusRenderer({ value }) {
  const cfg = STATUS_CONFIG[value] || STATUS_CONFIG.Settled;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11.5, fontWeight: 500,
      padding: "3px 10px", borderRadius: 20,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
      {value}
    </span>
  );
}

function CategoryRenderer({ value }) {
  const color = CATEGORY_COLORS[value] || "#64748b";
  return (
    <span style={{
      fontSize: 11.5, fontWeight: 500,
      padding: "3px 9px", borderRadius: 6,
      background: color + "18",
      color: color,
      border: `1px solid ${color}30`,
    }}>
      {value}
    </span>
  );
}

function DescriptionRenderer({ value, data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1.3, padding: "4px 0" }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{value}</span>
      <span style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{data.merchant}</span>
    </div>
  );
}

function IdRenderer({ value }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#6b7280" }}>
      {value}
    </span>
  );
}

function DateRenderer({ value }) {
  const formatted = new Date(value + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  return <span style={{ fontSize: 12.5, color: "#6b7280" }}>{formatted}</span>;
}

// ── Main Dashboard ─────────────────────────────────────────────────────

export default function App() {
  const gridRef = useRef();
  const [quickFilter, setQuickFilter] = useState("");
  const [rowCount, setRowCount] = useState(transactions.length);

  const stats = useMemo(() => {
    const income  = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expense, net: income - expense, count: transactions.length };
  }, []);

  const fmt = (n) => new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2,
  }).format(Math.abs(n));

  const columnDefs = useMemo(() => [
    {
      field: "id",
      headerName: "TXN ID",
      width: 108,
      pinned: "left",
      cellRenderer: IdRenderer,
      filter: "agTextColumnFilter",
    },
    {
      field: "date",
      headerName: "Date",
      width: 130,
      cellRenderer: DateRenderer,
      filter: "agDateColumnFilter",
      sort: "asc",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 220,
      cellRenderer: DescriptionRenderer,
      filter: "agTextColumnFilter",
      autoHeight: true,
    },
    {
      field: "category",
      headerName: "Category",
      width: 148,
      cellRenderer: CategoryRenderer,
      filter: "agTextColumnFilter",
    },
    {
      field: "account",
      headerName: "Account",
      width: 120,
      filter: "agTextColumnFilter",
      cellStyle: { fontSize: "12.5px", color: "#6b7280" },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      cellRenderer: StatusRenderer,
      filter: "agTextColumnFilter",
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 140,
      cellRenderer: AmountRenderer,
      filter: "agNumberColumnFilter",
      type: "numericColumn",
      pinned: "right",
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,
    suppressMovable: false,
  }), []);

  const onFilterChanged = useCallback(() => {
    if (gridRef.current?.api) {
      setRowCount(gridRef.current.api.getDisplayedRowCount());
    }
  }, []);

  const onQuickFilter = useCallback((e) => {
    setQuickFilter(e.target.value);
    gridRef.current?.api?.setGridOption("quickFilterText", e.target.value);
    setTimeout(() => {
      if (gridRef.current?.api) {
        setRowCount(gridRef.current.api.getDisplayedRowCount());
      }
    }, 50);
  }, []);

  const onExport = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({ fileName: "transactions-march-2024.csv" });
  }, []);

  const onResetFilters = useCallback(() => {
    gridRef.current?.api?.setFilterModel(null);
    gridRef.current?.api?.setGridOption("quickFilterText", "");
    setQuickFilter("");
    setRowCount(transactions.length);
  }, []);

  const getRowStyle = useCallback(({ data }) => {
    if (data?.status === "Failed") return { background: "#fff8f8" };
    if (data?.status === "Pending") return { background: "#fffdf5" };
    return {};
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body, #root { width: 100%; min-height: 100vh; background: #f4f3f0; }

        .ag-theme-alpine {
          --ag-font-family: 'DM Sans', sans-serif;
          --ag-font-size: 13px;
          --ag-header-background-color: #f9f8f6;
          --ag-header-foreground-color: #9ca3af;
          --ag-background-color: #ffffff;
          --ag-odd-row-background-color: #fdfdfc;
          --ag-row-hover-color: #f8f7f4;
          --ag-selected-row-background-color: #eff6ff;
          --ag-border-color: #f0ede8;
          --ag-cell-horizontal-border: none;
          --ag-header-column-separator-display: block;
          --ag-header-column-separator-color: #e5e7eb;
          --ag-row-border-color: #f5f4f1;
          --ag-cell-horizontal-padding: 14px;
          --ag-row-height: 56px;
          --ag-header-height: 44px;
          --ag-floating-filter-height: 36px;
          --ag-input-focus-border-color: #6366f1;
          --ag-range-selection-border-color: #6366f1;
          --ag-alpine-active-color: #6366f1;
          --ag-checkbox-checked-color: #6366f1;
          --ag-border-radius: 0px;
        }

        .ag-theme-alpine .ag-header-cell-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ag-theme-alpine .ag-floating-filter-input {
          font-size: 12px;
          border-radius: 6px;
        }

        .ag-theme-alpine .ag-root-wrapper {
          border-radius: 0 0 14px 14px;
          border: 1px solid #f0ede8;
          border-top: none;
          overflow: hidden;
        }

        .ag-theme-alpine .ag-paging-panel {
          border-top: 1px solid #f0ede8;
          background: #f9f8f6;
          font-size: 12px;
          color: #9ca3af;
          padding: 0 16px;
        }

        .ag-theme-alpine .ag-sort-indicator-icon {
          color: #6366f1;
        }

        .ag-theme-alpine .ag-header-cell:hover {
          background: #f3f4f6;
        }

        .kpi-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #f0ede8;
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
        }

        .kpi-accent {
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          border-radius: 14px 0 0 14px;
        }

        .toolbar-btn {
          height: 36px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          transition: background 0.12s, border-color 0.12s;
        }
        .toolbar-btn:hover { background: #f9f8f6; border-color: #d1d5db; }
        .toolbar-btn.primary { background: #111827; color: #fff; border-color: #111827; }
        .toolbar-btn.primary:hover { background: #1f2937; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f4f3f0", padding: "28px 32px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#9ca3af", textTransform: "uppercase", marginBottom: 4 }}>
              March 2024 · Finance
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: "#111827", letterSpacing: "-0.025em" }}>
              Transaction Ledger
            </h1>
          </div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {([
            { label: "Total Inflow",    value: fmt(stats.income),  accent: "#22c55e", sub: "Revenue & receipts" },
            { label: "Total Outflow",   value: fmt(stats.expense), accent: "#ef4444", sub: "Expenses & costs" },
            { label: "Net Position",    value: fmt(stats.net),     accent: "#6366f1", sub: "Positive cash flow" },
            { label: "Transactions",    value: stats.count,        accent: "#f59e0b", sub: `${rowCount} visible` },
          ]).map((c) => (
            <div key={c.label} className="kpi-card">
              <div className="kpi-accent" style={{ background: c.accent }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#111827", letterSpacing: "-0.03em", marginBottom: 4 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: "#d1d5db" }}>{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#fff",
          border: "1px solid #f0ede8",
          borderBottom: "none",
          borderRadius: "14px 14px 0 0",
          padding: "12px 16px",
          flexWrap: "wrap",
        }}>
          {/* Quick search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#9ca3af" }}>⌕</span>
            <input
              value={quickFilter}
              onChange={onQuickFilter}
              placeholder="Quick search all columns…"
              style={{
                width: "100%", height: 36,
                paddingLeft: 30, paddingRight: 12,
                borderRadius: 8, border: "1px solid #e5e7eb",
                background: "#f9f8f6", fontSize: 13,
                color: "#374151", outline: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          <div style={{ height: 24, width: 1, background: "#e5e7eb", flexShrink: 0 }} />

          <button className="toolbar-btn" onClick={onResetFilters}>
            ↺ Reset Filters
          </button>

          <button className="toolbar-btn primary" onClick={onExport}>
            ↓ Export CSV
          </button>

          <div style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
            {rowCount} of {stats.count} rows
          </div>
        </div>

        {/* AG Grid */}
        <div className="ag-theme-quartz" style={{ height: 540, width: "100%", minHeight: 540 }}>
          <AgGridReact
            ref={gridRef}
            rowData={transactions}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20]}
            animateRows={true}
            rowSelection={{ mode: "multiRow" }}
            getRowStyle={getRowStyle}
            onFilterChanged={onFilterChanged}
            enableCellTextSelection={true}
          />
        </div>

        <div style={{ marginTop: 12, fontSize: 11.5, color: "#c9c7c0", textAlign: "center" }}>
          
        </div>
      </div>
    </>
  );
}