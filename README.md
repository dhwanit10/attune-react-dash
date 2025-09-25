🛡️ Attendance System – Admin Panel (Frontend)

This is the Admin Panel frontend for our Attendance System.
It’s built with Vite + React + TypeScript and connects to the same C#/.NET backend API as the student-facing app.

🚀 Overview

The Admin Panel enables administrators and faculty to monitor and manage attendance across classes and students.
It offers analytics, student-level data, and manual attendance control.

🌟 Key Features

Class-Wide Analytics

View real-time attendance statistics for the whole class.

See daily, weekly, or monthly summaries.

Visual charts and graphs for quick insights.

Student-Level Details

Search or filter students to view their attendance history.

Drill down into a specific student’s attendance records.

Manual Attendance Management

Admin can mark Present or Absent for any student directly.

Override or correct attendance when needed.

Clean, Responsive UI built with React, Vite and TypeScript.

Secure API Integration with the same C# backend used by the student app.

🛠️ Tech Stack
Layer	Technology
Frontend	Vite + React + TypeScript
Charts/Analytics	(e.g. Recharts / Chart.js)
Backend API	C# / ASP.NET Core
Deployment	Vercel (Frontend) + (your backend host)
📦 Getting Started
1. Clone the repo
git clone https://github.com/yourusername/your-adminpanel-repo.git
cd your-adminpanel-repo

2. Install dependencies
npm install
# or
yarn install

3. Configure API URL

Create a .env file (if not already present):

VITE_API_URL=https://your-backend-url/api

4. Run locally
npm run dev


Access at http://localhost:8080
.

5. Build for production
npm run build


Deploy the dist folder to Vercel.

🖼️ Screens / Workflow

Dashboard: Overview of attendance stats for all classes.

Analytics Page: Graphs and charts (daily/weekly/monthly attendance).

Student Management: Search student → view details → mark present/absent.

Manual Override: Admin can update attendance records instantly.

🤝 Contributing

Fork the repo

Create a new branch: git checkout -b feature-name

Commit your changes: git commit -m "Add feature"

Push to branch: git push origin feature-name

Open a Pull Request

📄 License

This project is licensed under the MIT License.