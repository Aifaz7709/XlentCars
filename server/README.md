# XlentCar Backend

This is a minimal Node.js + Express backend for XlentCar using MySQL.

Quick start:

1. Copy `.env.example` to `.env` and fill DB credentials.
2. Install dependencies:

```bash
cd server
npm install
```

3. Create the database and run the migration in `migrations/create_users.sql` (or run it manually in your MySQL client).
4. Start server:

```bash
npm run dev
```

Default server: http://localhost:5000

Endpoints:
- `POST /api/auth/register` — body: `{ customerName, email, phoneNumber, vehicleRegNumber, password }`
- `POST /api/auth/login` — body: `{ email, password }`
