# 🛍️ Shopping Site — Full-Stack E-Commerce Application

A full-stack e-commerce web application built as a **Database Management Systems** course
project. It combines a **PostgreSQL** database driven by hand-written SQL **functions,
stored procedures and views** with a modern **ASP.NET Core Web API** backend and a
**React + TypeScript** single-page frontend.

> The focus of the project is on the **database layer** — most read/write operations go
> through PostgreSQL functions and procedures rather than plain ORM calls, demonstrating
> stored-procedure design, views, joins and parameterised queries.

---

## ✨ Features

- 🔐 **JWT authentication** with BCrypt password hashing and role-based authorization (Admin / Customer)
- 🛒 Product catalogue with filtering by **gender + category**, full-text **search** and **sorting**
- 🧺 Shopping cart and checkout flow backed by SQL views and procedures
- 👤 Customer profile management (edit / delete) via stored procedures
- ⭐ Product reviews joined with customer data through SQL views
- 🛠️ **Admin panel**: add / update / delete products, view and manage customers, mute customers
- 📖 Interactive **Swagger** API documentation with JWT support

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, React Router 6, Axios |
| **Backend** | ASP.NET Core 8 Web API, Entity Framework Core 8 |
| **Database** | PostgreSQL (functions, procedures, views, EF Core migrations) |
| **Auth** | JWT Bearer tokens, BCrypt.Net |
| **Docs** | Swagger / Swashbuckle |

---

## 🗂️ Project Structure

```
DBMS/
├── ShoppingSiteAPI/ShoppingSiteAPI/   # ASP.NET Core Web API
│   ├── Controllers/                   # REST endpoints
│   ├── Database/                      # EF Core entities + AppDbContext
│   ├── DTOs/                          # Data-transfer objects (function/view results)
│   ├── Middleware/                    # Global exception handling
│   ├── Migrations/                    # EF Core migrations (schema, functions, views, procedures)
│   ├── Program.cs                     # App startup, DI, auth, CORS, Swagger
│   └── appsettings.json               # Configuration (JWT, connection string, CORS)
│
└── frontend/                          # React + TypeScript SPA
    └── src/
        ├── Components/                # App shell, Navbar, contexts
        ├── pages/                     # Home, Shop, Cart, Checkout, Profile, Admin, ...
        ├── api/                       # Central Axios client (base URL + auth interceptor)
        └── Styles/                    # CSS
```

---

## 🚀 Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/download/)

### 1. Database

Create a PostgreSQL database (default name `supermarketDb`). The schema, SQL functions,
procedures and views are all created automatically by the EF Core migrations.

### 2. Backend

```bash
cd ShoppingSiteAPI/ShoppingSiteAPI

# Configure the connection string & JWT key (see Configuration below)
# then apply migrations and run:
dotnet tool install --global dotnet-ef        # first time only
dotnet ef database update
dotnet run
```

The API starts at `https://localhost:7192` and Swagger UI is available at
`https://localhost:7192/swagger`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`.

---

## ⚙️ Configuration

Backend settings live in `appsettings.json` (non-secret defaults) and
`appsettings.Development.json` (local secrets — **git-ignored**):

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
  "AdminEmails": [ "admin@shoppingsite.com" ]   // accounts logging in with these emails get the Admin role
}
```

> **Production:** never commit real secrets. Provide `Jwt:Key` and the connection string
> through environment variables or `dotnet user-secrets` instead.

Frontend settings live in `frontend/.env`:

```
REACT_APP_API_URL=https://localhost:7192
```

---

## 🔐 Security Notes

- Passwords are hashed with **BCrypt** — never stored in plain text.
- Authentication uses **JWT Bearer** tokens signed with a configurable secret.
- Endpoints are protected with `[Authorize]` / `[Authorize(Roles = "Admin")]`.
- The JWT signing key, DB credentials and CORS origins are read from configuration, not hard-coded.
- Unhandled exceptions are caught by middleware and returned as safe `ProblemDetails`
  (no stack traces leak to clients in Production).

---

## 🗄️ Database Highlights (DBMS focus)

The project deliberately pushes logic into the database:

- **Functions** — e.g. `select_all_products()`, `select_products_by_gender_and_categories()`,
  `ultimate_select()` (combined filter + search + sort).
- **Stored procedures** — e.g. `insert_customer()`, `edit_profile()`, `update_product()`,
  `delete_customer()`.
- **Views** — for joined read models (cart items × products, orders × ordered items × products,
  reviews × customers, muted customers × customers).
- **Migrations** — the full schema, foreign keys with cascade deletes, functions, procedures
  and views are versioned as EF Core migrations.

---

## 📸 Screenshots

_Add screenshots of the Home, Shop, Cart, Checkout and Admin pages here._

| Home | Shop | Admin |
|------|------|-------|
| _tbd_ | _tbd_ | _tbd_ |

---

## 📝 License

This project was created for educational purposes as part of a university DBMS course.
