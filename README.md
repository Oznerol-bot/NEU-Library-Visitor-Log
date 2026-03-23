# NEU Library Visitor Log 📚

A comprehensive web-based visitor management system designed for the **New Era University (NEU)** Library. This application streamlines the check-in process for students and faculty while providing administrators with real-time analytics and reporting tools.
<br>

**🚀 DEPLOYED PROJECT LINK:** [(https://neu-library-visitor-log-khaki.vercel.app/)](https://neu-library-visitor-log-khaki.vercel.app/)

---

## ✨ Features
<br>

### 👤 Visitor Side
* **Institutional Login:** Secure authentication using Google OAuth, restricted to `@neu.edu.ph` domains.
<br>

* **Dynamic Profile Setup:** Visitors can save their details (Name, College, Course, Year Level) for faster future check-ins.
<br>

* **Simplified Check-in:** A one-click log entry system with categorized reasons for visiting (Study, Research, Borrowing, etc.).

---

### 🛡️ Admin Dashboard
* **Secure Admin Login:** Multi-layer security check against a Firestore registry.
<br>

* **Real-time Analytics:** Daily, Weekly, and Total visitor counters that update instantly without refreshing.
<br>

* **Dynamic Charting:** Visual breakdown of visitors by College using **Chart.js**.
<br>

* **Advanced Filtering:** Flexible search system allowing admins to filter logs by College, Reason, Visitor Type, Year, or Course.
<br>

* **Reporting:** Export filtered data directly to **PDF** for official library documentation.

---

## 🛠️ Tech Stack
* **Frontend:** HTML5, CSS3 (Modern UI), JavaScript (ES6+)
<br>

* **Backend/Database:** Firebase Firestore (NoSQL)
<br>

* **Authentication:** Firebase Auth (Google Provider)
<br>

* **Deployment:** Vercel

---

## 🔒 Security Configuration
The system is protected by **Firestore Security Rules** to ensure:
<br>

1. Visitors can only create logs and read/update their own profiles.
<br>

2. Administrative data (Full Logs, Admin Registry) is only accessible to verified accounts in the admin collection.

---

## 📖 How to Use
### Visitors:
1. Scan the QR code or visit the URL.
<br>

2. Sign in with your **NEU Google account**.
<br>

3. Fill in your details (first time only) and click **Log Visit**.

<br>

### Admins:
1. Navigate to the **Admin Login**.
<br>

2. View real-time statistics on the dashboard.
<br>

3. Use the filter controls to generate specific reports and click **Export to PDF**.

<br>

---
**Developed for New Era University - College of Informatics and Computing Studies**
