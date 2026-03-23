NEU Library Visitor Log 📚

A comprehensive web-based visitor management designed for the New Era University (NEU) Library. This application streamlines the check-in process for students and faculty while providing administrators with real-time analytics and reporting tools.

DEPLOYED PROJECT LINK: [(https://neu-library-visitor-log-khaki.vercel.app/)](https://neu-library-visitor-log-khaki.vercel.app/)

✨ Features

👤 Visitor Side
Institutional Login: Secure authentication using Google OAuth, restricted to @neu.edu.ph domains.

Dynamic Profile Setup: Visitors can save their details (Name, College, Course, Year Level) for faster future check-ins.

Simplified Check-in: A one-click log entry system with categorized reasons for visiting (Study, Research, Borrowing, etc.).


🛡️Admin Dashboard
Secure Admin Login: Multi-layer security check against a Firestoreregistry.

Real-time Analytics: * Daily, Weekly, and Total visitor counters that update instantly without refreshing.

Dynamic Charting: Visual breakdown of visitors by College using Chart.js.

Advanced Filtering: Flexible search system allowing admins to filter logs by College, Reason, Visitor Type, Year, or Course.

Reporting: Export filtered data directly to PDF for official library documentation.


🛠️ Tech Stack
Frontend: HTML5, CSS3 (Modern UI), JavaScript (ES6+)

Backend/Database: Firebase Firestore (NoSQL)

Authentication: Firebase Auth (Google Provider)

Deployment: Vercel


🔒 Security Configuration

The system is protected by Firestore Security Rules to ensure:

Visitors can only create logs and read/update their own profiles.

Administrative data (Full Logs, Admin Registry) is only accessible to verified accounts in the admin collection.



📖 How to Use
Visitors: * Scan the QR code or visit the URL.

Sign in with your NEU Google account.

Fill in your details (first time only) and click Log Visit.

Admins: * Navigate to the Admin Login.

View real-time statistics on the dashboard.

Use the filter controls to generate specific reports and click Export to PDF.
