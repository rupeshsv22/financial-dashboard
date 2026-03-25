# Employee Dashboard

This project is a React application that implements a dashboard to display employee data using AG Grid. The dashboard provides a clean and professional interface for viewing employee information.

## Project Structure

```
employee-dashboard
├── public
│   └── index.html          # Main HTML file serving the React app
├── src
│   ├── components
│   │   ├── EmployeeGrid.jsx # Component for displaying employee data in a grid
│   │   └── DashboardHeader.jsx # Component for the dashboard header
│   ├── data
│   │   └── employees.js     # Employee dataset
│   ├── styles
│   │   └── dashboard.css     # CSS styles for the dashboard
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Entry point for the React application
│   └── index.css            # Global CSS styles
├── package.json             # npm configuration file
├── vite.config.js           # Vite configuration file
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd employee-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the dashboard.

## Usage

The dashboard displays a grid of employee data, including details such as:

- First Name
- Last Name
- Email
- Department
- Position
- Salary
- Hire Date
- Age
- Location
- Performance Rating
- Projects Completed
- Active Status
- Skills
- Manager

You can filter, sort, and interact with the data in the grid for better insights.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.