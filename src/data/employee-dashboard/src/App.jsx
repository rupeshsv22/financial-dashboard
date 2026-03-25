import React from 'react';
import EmployeeGrid from './components/EmployeeGrid';
import DashboardHeader from './components/DashboardHeader';
import './styles/dashboard.css';

export default function App() {
  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <EmployeeGrid />
    </div>
  );
}