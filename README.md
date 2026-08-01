# 🚀 HisaabBook API

Backend for **HisaabBook**, a modern CRM application for managing **Companies, Contacts, Deals, and Tasks**.

🔗 **Live API:** https://hisaabbook-api.onrender.com
🌐 **Frontend:** https://hisaab-book-three.vercel.app

---

## ✨ Overview

HisaabBook API is built with **NestJS**, **GraphQL**, and **PostgreSQL**, providing a scalable backend for CRM operations.

Instead of writing repetitive CRUD resolvers, the project uses **@ptc-org/nestjs-query**, enabling automatic GraphQL CRUD operations with built-in support for:

* Pagination
* Filtering
* Sorting
* Aggregate queries
* Relation handling

The backend also includes authentication, role-based authorization, migrations, DataLoader support, and production-ready architecture.

---
## 🏗 Architecture Flow

<p align="center">
  <img
    src="https://github.com/user-attachments/assets/37baa152-962f-453e-8a98-076693439855"
    alt="ER Diagram"
    width="45%"
  />
  <img
    src="https://github.com/user-attachments/assets/68241e00-d1c5-481e-a2a4-71ac54c4e187"
    alt="Request Flow"
    width="45%"
  />
</p>

# 🛠 Tech Stack

| Category              | Technology                   |
| --------------------- | ---------------------------- |
| Framework             | NestJS 10                    |
| API                   | GraphQL, Apollo Server 4     |
| ORM                   | TypeORM 0.3.x                |
| Database              | PostgreSQL (Neon Serverless) |
| Authentication        | JWT, Passport-JWT            |
| Password Hashing      | bcrypt                       |
| CRUD Generation       | @ptc-org/nestjs-query        |
| Relation Optimization | DataLoader                   |
| Deployment            | Render                       |

---

# ✨ Features

* JWT Authentication
* User Registration & Login
* Demo Login
* Role-Based Authorization
* GraphQL API
* Auto-generated CRUD Resolvers
* Pagination
* Filtering
* Sorting
* Aggregate Queries
* PostgreSQL Database
* TypeORM Migrations
* DataLoader for N+1 Prevention
* Production-ready Configuration

---

# 📦 Data Model

The application contains **7 core entities**:

* User
* Company
* Contact
* Deal
* DealStage
* Task
* TaskStage

### Relationships

* Users own companies, contacts, deals, and tasks.
* Companies contain contacts and deals.
* Deals belong to companies and can optionally reference a contact.
* Deals belong to a deal stage.
* Tasks support:

  * JSON checklist
  * Multiple assigned users
  * Multiple linked contacts
* DealStage and TaskStage are maintained as reference entities through the API.

---

# 🔐 Authentication

The API supports:

* Email & Password Registration
* Email & Password Login
* JWT-based Authentication
* Password Hashing using bcrypt

### Demo Login

A dedicated `demoLogin` mutation allows visitors to explore the application without creating an account.

The demo user only has access to its own seeded data.

> **Note:** Password reset functionality is not implemented yet. The frontend contains the UI, but no backend logic currently exists.

---

# 🛡 Authorization

Authorization is enforced **entirely on the server**, ensuring data cannot be accessed by modifying GraphQL queries from the client.

### Roles

* ADMIN
* SALES_MANAGER
* SALES_PERSON
* SALES_INTERN

### Access Rules

| Role          | Access           |
| ------------- | ---------------- |
| ADMIN         | Full access      |
| SALES_MANAGER | Full access      |
| SALES_PERSON  | Own records only |
| SALES_INTERN  | Own records only |

Ownership is validated using:

* createdById
* salesOwnerId
* dealOwnerId

Authorization is implemented using **@ptc-org/nestjs-query Authorizers**.

---

# ⚡ GraphQL

The API exposes GraphQL endpoints with support for:

* CRUD Operations
* Pagination
* Filtering
* Sorting
* Aggregations
* Nested Relations

Development includes GraphQL Playground, while production disables Playground and schema introspection.

---

# 🌱 Environment Variables

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

JWT_SECRET=your_secret

FRONTEND_URL=https://hisaab-book-three.vercel.app

NODE_ENV=production
```

| Variable     | Description                                                |
| ------------ | ---------------------------------------------------------- |
| DATABASE_URL | PostgreSQL connection string                               |
| JWT_SECRET   | JWT signing secret                                         |
| FRONTEND_URL | Allowed frontend origins (supports comma-separated values) |
| NODE_ENV     | Enables production configuration                           |

> If `FRONTEND_URL` is omitted, CORS allows all origins. This is useful for local development but **not recommended for production**.

---

# 🚀 Getting Started

## Install Dependencies

```bash
npm install
```

Create a `.env` file using the environment variables shown above.

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build

npm run start:prod
```

When running in development (`NODE_ENV` is not `production`), GraphQL Playground is available at:

```
http://localhost:3000/graphql
```

---

# 🗄 Database Migrations

The project uses **TypeORM Migrations**.

Database synchronization is disabled in production.

Generate a migration:

```bash
npm run migration:generate -- src/migrations/<migration-name>
```

Run migrations:

```bash
npm run migration:run
```

Revert the latest migration:

```bash
npm run migration:revert
```

---

# ☁ Deployment

The application is deployed on **Render** as a Node.js Web Service.

### Build Command

```bash
npm install --include=dev && npm run build
```

### Start Command

```bash
npm run start:prod
```

---

# 📌 Project Highlights

* Built using NestJS modular architecture
* GraphQL-first API
* Automatic CRUD generation
* Secure JWT authentication
* Role-based authorization
* PostgreSQL with TypeORM migrations
* DataLoader integration for optimized relation fetching
* Production-ready deployment on Render

---

# 📄 License

No license has been specified.

**All rights reserved.**
