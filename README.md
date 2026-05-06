# Full-Stack CRM Lead Management System

## 1. Project Overview
The Full-Stack CRM Lead Management Web Application is a centralized platform designed to help sales teams and businesses effectively track and manage their potential customers. It streamlines the sales pipeline by allowing users to create leads, update their statuses through various stages of the sales funnel, add descriptive notes, and view analytical statistics on a dynamic dashboard.

## 2. Tech Stack
- **Frontend:** React
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)

## 3. Features
- **Secure User Login:** Authenticated access using JWT.
- **Lead CRUD Operations:** Create, Read, Update, and Delete potential customer records.
- **Lead Status Tracking:** Track leads through customized pipeline stages (New, Contacted, Qualified, Proposal Sent, Won, Lost).
- **Notes System:** Add, view, and manage specific notes for each lead to keep track of communications and requirements.
- **Interactive Dashboard:** View high-level statistics and metrics regarding your sales pipeline.
- **Search & Filtering:** Easily locate specific leads using dynamic search and status filtering.

## 4. How to Run Locally

Follow these steps to get the project running on your local machine:

### Prerequisites
- Node.js installed on your machine
- PostgreSQL installed and running

### Step-by-step Setup
1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd fullstack-crm
   ```

2. **Install dependencies**
   Open two terminal windows/tabs to setup both backend and frontend.
   
   *Terminal 1 (Backend):*
   ```bash
   cd server
   npm install
   ```

   *Terminal 2 (Frontend):*
   ```bash
   cd client
   npm install
   ```

3. **Setup Environment Variables**
   Create a `.env` file in the root of the `server` directory and add the configuration shown in the Environment Variables section below.

4. **Setup Database**
   Create a PostgreSQL database and configure the tables using the SQL provided in the Database Setup section.

5. **Run both servers**
   *Terminal 1 (Backend):*
   ```bash
   npm run dev
   ```
   
   *Terminal 2 (Frontend):*
   ```bash
   npm run dev
   ```
   
   The application should now be running. The React frontend typically defaults to `http://localhost:5173` (if using Vite) or `http://localhost:3000`.

## 5. Environment Variables

Create a `.env` file in the backend/server directory with the following variables:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=crm_db
DB_PASSWORD=your_secure_password
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

## 6. Test Login Credentials

To test the application quickly without registering a new account, you can use the following default credentials (ensure they are seeded into your database):

- **Email:** `admin@example.com`
- **Password:** `password123`

## 7. Database Setup

First, connect to your PostgreSQL instance and create the database:
```sql
CREATE DATABASE crm_db;
\c crm_db;
```

Run the following SQL commands to set up the necessary tables for users, leads, and notes:

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads Table
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes Table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 8. Known Limitations
- **Email Integration:** The system currently does not support automated email parsing or sending emails directly from the dashboard.
- **Role-Based Access Control (RBAC):** There is currently only one user tier. Multi-tenant features or Admin/Standard user roles are not yet implemented.
- **File Attachments:** Lead notes are currently text-only; document or image uploads are not supported.

## 9. Reflection
Building this Full-Stack CRM was an excellent deep dive into architectural design and full-stack integration. Setting up the PostgreSQL database and enforcing data integrity across relational tables (like cascading deletes from leads to notes) reinforced my backend modeling skills. Additionally, bridging the gap between a modern React frontend and a secure Node/Express REST API highlighted the importance of robust JWT authentication workflows, clean state management, and clear UI/UX principles for data-heavy applications.
