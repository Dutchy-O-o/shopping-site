<div align="center">

# 🛍️ Shopping Site

### A full-stack e-commerce platform — ASP.NET Core · React · PostgreSQL

Product catalog, cart & checkout, reviews and an admin panel, powered by a
database layer built on PostgreSQL **functions, stored procedures and views**.

![.NET](https://img.shields.io/badge/.NET%208-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📖 Overview

Shopping Site is a full-stack e-commerce web application built as a **Database
Management Systems** course project. The emphasis is on the **database layer** —
most read and write operations are executed through PostgreSQL functions and
stored procedures rather than plain ORM calls, showcasing stored-procedure
design, views, joins and parameterised queries.

It ships with a secure **ASP.NET Core 8 Web API** backend and a modern
**React + TypeScript** single-page frontend.

## ✨ Features

- 🔐 **JWT authentication** with BCrypt password hashing
- 🛡️ **Role-based authorization** (Admin / Customer) enforced with `[Authorize]`
- 🛒 Product catalog with **gender + category filtering**, **search** and **sorting**
- 🧺 **Shopping cart & checkout** backed by SQL views and procedures
- 👤 Customer **profile management** (edit / delete) via stored procedures
- ⭐ **Product reviews** joined with customer data through SQL views
- 🛠️ **Admin panel** — manage products, customers and muted users
- 📖 Interactive **Swagger** API docs with JWT support

## 🧱 Tech Stack

<table>
  <tr><td><b>Frontend</b></td><td>React 18 · TypeScript · React Router 6 · Axios</td></tr>
  <tr><td><b>Backend</b></td><td>ASP.NET Core 8 Web API · Entity Framework Core 8</td></tr>
  <tr><td><b>Database</b></td><td>PostgreSQL — functions, procedures, views, EF Core migrations</td></tr>
  <tr><td><b>Auth</b></td><td>JWT Bearer tokens · BCrypt.Net</td></tr>
  <tr><td><b>API Docs</b></td><td>Swagger / Swashbuckle</td></tr>
</table>

## 🗂️ Project Structure

```
shopping-site/
├── ShoppingSiteAPI/ShoppingSiteAPI/   # ASP.NET Core Web API
│   ├── Controllers/                   # REST endpoints
│   ├── Database/                      # EF Core entities + AppDbContext
│   ├── DTOs/                          # DTOs for function/view results
│   ├── Middleware/                    # Global exception handling
│   ├── Migrations/                    # Schema, functions, views, procedures
│   └── Program.cs                     # Startup: DI, auth, CORS, Swagger
│
└── frontend/                          # React + TypeScript SPA
    └── src/
        ├── api/                       # Central Axios client (base URL + auth)
        ├── Components/                # App shell, Navbar
        ├── pages/                     # Home, Shop, Cart, Checkout, Profile, Admin…
        └── Styles/                    # CSS
```

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/download/)

### 1️⃣ Database

Create a PostgreSQL database named `supermarketDb`. The schema, SQL functions,
procedures and views are created automatically by the EF Core migrations.

### 2️⃣ Backend

```bash
cd ShoppingSiteAPI/ShoppingSiteAPI
dotnet tool install --global dotnet-ef   # first time only
dotnet ef database update                # apply migrations
dotnet run
```

API → `https://localhost:7192` · Swagger → `https://localhost:7192/swagger`

### 3️⃣ Frontend

```bash
cd frontend
npm install
npm start
```

App → `http://localhost:3000`

## ⚙️ Configuration

Backend config lives in `appsettings.json` (non-secret defaults) and
`appsettings.Development.json` (local secrets, **git-ignored**):

```jsonc
{
  "ConnectionStrings": {
    "WebAPIDatabase": "Host=localhost; Database=supermarketDb; Username=postgres; Password=your_password"
  },
  "Jwt": {
    "Key": "a-long-random-secret-of-at-least-32-characters",
    "Issuer": "ShoppingSiteAPI",
    "Audience": "ShoppingSiteClient",
    "ExpiryHours": 2
  },
  "Cors": { "AllowedOrigins": [ "http://localhost:3000" ] },
  "AdminEmails": [ "admin@shoppingsite.com" ]
}
```

Frontend config lives in `frontend/.env`:

```
REACT_APP_API_URL=https://localhost:7192
```

> **Production:** never commit real secrets — provide `Jwt:Key` and the connection
> string through environment variables or `dotnet user-secrets`.

## 🔐 Security

- Passwords hashed with **BCrypt** — never stored in plain text
- Stateless **JWT Bearer** authentication signed with a configurable secret
- Endpoints protected with `[Authorize]` / `[Authorize(Roles = "Admin")]`
- Secrets, DB credentials and CORS origins read from configuration, not hard-coded
- Unhandled errors caught by middleware and returned as safe **ProblemDetails**
  (no stack traces leak to clients)

## 🗄️ Database Highlights (DBMS focus)

The project deliberately pushes logic into the database:

- **Functions** — `select_all_products()`, `select_products_by_gender_and_categories()`,
  `ultimate_select()` (combined filter + search + sort)
- **Stored procedures** — `insert_customer()`, `edit_profile()`, `update_product()`,
  `delete_customer()`
- **Views** — joined read models (cart × products, orders × items × products,
  reviews × customers, muted customers × customers)
- **Migrations** — schema, foreign keys with cascade deletes, functions, procedures
  and views versioned as EF Core migrations

## 📝 License

Created for educational purposes as part of a university DBMS course.
