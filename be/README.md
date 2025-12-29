# Backend - Vantage FIRE App

## Tech Stack

- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js
- **Authentication**: Better-Auth with Google OAuth
- **Database**: PostgreSQL (via Prisma ORM)
- **Deployment**: Docker + Docker Compose

## Project Structure

```
be/
├── src/
│   ├── index.ts          # Express server entry point
│   └── lib/
│       └── auth.ts       # Better-Auth configuration
├── prisma/
│   └── schema.prisma     # Database schema
├── .env                  # Environment variables
├── Dockerfile            # Container definition
└── package.json          # Dependencies
```

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Google OAuth credentials (Client ID & Secret)

### Environment Variables

Create a `.env` file in the `be/` directory:

```env
DATABASE_URL="postgresql://user:password@db:5432/fiery_db?schema=public"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BETTER_AUTH_SECRET="any-random-secret-string"
BETTER_AUTH_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:5173"
```

### Running the App

**With Docker (Recommended):**
```bash
# From project root
docker compose up --build
```

**Local Development:**
```bash
cd be
npm install
npx prisma generate
npm run dev
```

## Database Schema Workflow

### Adding/Modifying Tables

1. **Edit the schema**: Update `prisma/schema.prisma`
   ```prisma
   model NewTable {
     id   String @id @default(uuid())
     name String
   }
   ```

2. **Generate Prisma Client**: This creates TypeScript types
   ```bash
   npx prisma generate
   ```

3. **Create Migration**: Apply changes to database
   ```bash
   npx prisma migrate dev --name add_new_table
   ```

4. **Rebuild Docker** (if using Docker):
   ```bash
   docker compose up --build
   ```

### Quick Reference

| Command | Purpose |
|---------|---------|
| `npx prisma generate` | Generate TypeScript client from schema |
| `npx prisma migrate dev` | Create and apply migration |
| `npx prisma studio` | Open database GUI |
| `npx prisma db push` | Push schema without migration (dev only) |

## API Endpoints

- `GET /api/health` - Health check
- `/api/auth/*` - Better-Auth endpoints (login, logout, session, etc.)

## Notes

- The database runs in a Docker container on port `5432`
- Backend server runs on port `3001`
- Prisma Client is auto-generated - don't edit `node_modules/@prisma/client`
- Better-Auth handles user sessions and OAuth flow automatically
