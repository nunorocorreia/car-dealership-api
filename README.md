# Car Dealership API

> **Work in progress** -- this project is under active development.

REST API for a car dealership built with Fastify, TypeScript, and SQLite.

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Fastify 5
- **Language:** TypeScript 5
- **Database:** SQLite (via better-sqlite3)
- **ORM:** Drizzle ORM
- **Docs:** Swagger / OpenAPI 3.0 (at `/docs`)

## Getting Started

```bash
pnpm install
pnpm dev
```

The server starts at `http://localhost:3000`. On first run, the database is created at `./data/dealership.db` and seeded with 100 sample cars.

API docs are available at `http://localhost:3000/docs`.

## Endpoints

| Method | Path        | Description          |
|--------|-------------|----------------------|
| GET    | /health     | Health check         |
| GET    | /cars       | List cars (paginated)|
| GET    | /cars/:id   | Get car by ID        |
| GET    | /leads      | List all leads       |
| POST   | /leads      | Create a new lead    |
| GET    | /docs       | Swagger UI           |

### Query Parameters for `GET /cars`

| Param    | Type   | Default | Description              |
|----------|--------|---------|--------------------------|
| page     | number | 1       | Page number              |
| limit    | number | 10      | Results per page (max 100)|
| make     | string |         | Filter by make           |
| model    | string |         | Filter by model          |
| minPrice | number |         | Minimum price            |
| maxPrice | number |         | Maximum price            |
| minYear  | number |         | Minimum year             |
| maxYear  | number |         | Maximum year             |
| sortBy   | string |         | Sort field: price, year, mileage |
| order    | string | asc     | Sort order: asc, desc    |

### Example

```bash
curl "http://localhost:3000/cars?make=Toyota&sortBy=price&order=desc&page=1&limit=5"
```

### `POST /leads`

Creates a lead linking a customer to a car. The `carId` must reference an existing car.

| Field         | Type   | Required | Description                              |
|---------------|--------|----------|------------------------------------------|
| carId         | string | yes      | ID of the car (must exist)               |
| type          | string | yes      | TEST_DRIVE, INQUIRY, or PURCHASE         |
| name          | string | yes      | Customer name                            |
| email         | string | yes      | Customer email (validated format)        |
| phone         | string | yes      | Customer phone                           |
| preferredDate | string | yes      | Preferred date (YYYY-MM-DD)              |
| message       | string | no       | Optional message                         |

```bash
curl -X POST http://localhost:3000/leads \
  -H "Content-Type: application/json" \
  -d '{
    "carId": "1",
    "type": "TEST_DRIVE",
    "name": "Nuno",
    "email": "nuno@mail.com",
    "phone": "+49123456789",
    "preferredDate": "2026-03-01",
    "message": "Can I test drive Saturday?"
  }'
```

## Architecture

Each feature is organized as a **module** with four layers. Requests flow top-down through the stack:

```
Route  -->  Handler  -->  Service  -->  Database
```

- **Route** -- defines the HTTP method, path, and validation schema. No logic.
- **Handler** -- reads the request, calls the service, and writes the response.
- **Service** -- contains business logic and database queries. The only layer that talks to Drizzle/SQLite.
- **Schema** -- JSON schemas used by Fastify for request validation and response serialization.

Adding a new feature means creating a new module folder under `src/modules/` with these four files, then registering the routes in `app.ts`.

## Project Structure

```
src/
  config/          # Environment configuration
  data/            # Seed data (cars.json)
  db/              # Database connection, schema, migrations
  models/          # TypeScript interfaces
  modules/
    car/           # Car module (routes, handlers, service, schemas)
    lead/          # Lead module (routes, handlers, service, schemas)
  plugins/         # Fastify plugins (CORS, Swagger)
  routes/          # Standalone routes (health)
drizzle/           # SQL migration files
```

## Scripts

| Command            | Description                     |
|--------------------|---------------------------------|
| `pnpm dev`         | Start dev server (hot reload)   |
| `pnpm build`       | Compile TypeScript              |
| `pnpm start`       | Run production build            |
| `pnpm db:generate` | Generate migrations from schema |
| `pnpm db:migrate`  | Run pending migrations          |
| `pnpm db:studio`   | Open Drizzle Studio (browse DB) |
