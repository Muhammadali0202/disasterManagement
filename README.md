# disasterManagement\# 🚨 Disaster Response Command Center (DRCS)

![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MySQL-indigo)
![Deployment](https://img.shields.io/badge/Deployed-Vercel%20%7C%20Render-success)

The **Disaster Response Command Center (DRCS)** is a full-stack, state-driven workflow application designed to orchestrate disaster relief efforts. It provides a centralized command dashboard for emergency responders to log disasters, manage relief camps, track complex logistics, and coordinate volunteer deployments across different regions.

## ✨ Core Features

* **Command Dashboard:** Real-time metrics on active disasters, operational relief camps, and deployed volunteers.
* **Role-Based Workflow:** Distinct operational flows for Incident Commanders (IC), District Coordination Officers (DCO), and Logistics Officers (LO).
* **Smart Logistics & Inventory:** Many-to-many relationship tracking for camp resources, supporting complex UPSERT operations and dispatch transits.
* **Volunteer Registry:** Categorized volunteer tracking (Medical, Rescue, Logistics) mapped to specific camps and disasters.
* **System Audit Logging:** Automated database triggers that permanently log administrative actions and structural deletions for security compliance.
* **Responsive UI:** A mobile-optimized React frontend featuring blurred overlays, conditional rendering, and slide-out navigation.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS for responsive styling
* Hosted on **Vercel**

**Backend:**
* Node.js & Express.js
* RESTful API Architecture
* Hosted on **Render**

**Database & Infrastructure:**
* MySQL (Hosted on **Aiven Cloud**)
* `mysql2/promise` for asynchronous connection pooling
* Docker-ready architecture for containerized deployment

---

## 🚀 Local Setup & Installation

To run this project locally, you will need **Node.js** and **MySQL** installed on your machine.

### 1. Database Setup
1. Create a local MySQL database named `drcs_db`.
2. Locate the `init.sql` file in the backend repository.
3. Run the SQL script to generate the tables, constraints, triggers, and dummy data.

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd drcs-backend
npm install
Create a .env file in the root of the backend folder and add your database credentials:Code snippetPORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=drcs_db
DB_PORT=3306
Start the server:Bashnpm start
# Server will run on http://localhost:5000
3. Frontend SetupNavigate to the frontend directory:Bashcd drcs-frontend
npm install
Start the development server:Bashnpm run dev
# App will run on http://localhost:5173 (or similar)
Note: Ensure your API fetch URLs in the React components point to your local backend (http://localhost:5000) during local testing.📡 Core API EndpointsMethodEndpointDescriptionGET/api/dashboard/statsFetches high-level metrics for the overview panelGET/api/volunteersRetrieves all registered volunteers with their assigned campsPOST/api/volunteersRegisters a new volunteer with assigned skillsGET/api/inventory/:camp_idJoins resources to fetch specific camp stockPOST/api/inventoryUPSERT logic to add or update resource quantitiesGET/api/logsFetches the 50 most recent system audit logs🗺️ Future RoadmapState-Driven Workflow: Implementing specific requisition approval matrices for DCOs to approve IC requests.Machine Learning Integration: A Python microservice to forecast resource demand (e.g., Tents, Water) based on disaster severity.Dockerization: Fully containerizing the frontend, backend, and database using docker-compose for 1-click deployments.
👨‍💻 Author Muhammad Ali * Student & ResearcherReach out on LinkedIn or GitHub