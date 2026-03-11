# Car Dealership

> **Work in progress** -- this project is under active development.

Full-stack car dealership application with a Fastify REST API and a React frontend.

## Tech Stack

### Backend
- **Runtime:** Node.js 22
- **Framework:** Fastify 5
- **Language:** TypeScript 5
- **Database:** SQLite (via better-sqlite3)
- **ORM:** Drizzle ORM
- **Docs:** Swagger / OpenAPI 3.0 (at `/docs`)

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Features:** Car inventory browsing with filters, sorting, and pagination

## Getting Started

### Backend

```bash
pnpm install
pnpm dev
```

The API starts at `http://localhost:3000`. On first run, the database is created at `./data/dealership.db` and seeded with 100 sample cars.

API docs are available at `http://localhost:3000/docs`.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend starts at `http://localhost:5173`. It proxies API requests to the backend via Vite's dev server proxy (`/api/*` -> `http://localhost:3000`).

## Endpoints

| Method | Path                            | Description            |
|--------|---------------------------------|------------------------|
| GET    | /health                         | Health check           |
| GET    | /cars                           | List cars (paginated)  |
| GET    | /cars/:id                       | Get car by ID          |
| GET    | /cars/:id/images                | List images for a car  |
| POST   | /cars/:id/images                | Upload a car image     |
| DELETE | /cars/:id/images/:imageId       | Delete a car image     |
| PATCH  | /cars/:id/images/:imageId/primary | Set primary image    |
| GET    | /leads                          | List all leads         |
| POST   | /leads                          | Create a new lead      |
| GET    | /sales                          | List all sales         |
| POST   | /sales                          | Create a sale          |
| PATCH  | /cars/:id/discount              | Set/clear per-car discount |
| GET    | /discounts                      | List discount rules    |
| POST   | /discounts                      | Create a discount rule |
| PATCH  | /discounts/:id                  | Update a discount rule |
| DELETE | /discounts/:id                  | Delete a discount rule |
| GET    | /stats                          | Dashboard stats        |
| GET    | /docs                           | Swagger UI             |

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
src/                         # Backend source
  config/                    # Environment configuration
  data/                      # Seed data (cars.json)
  db/                        # Database connection, schema, migrations
  models/                    # TypeScript interfaces
  modules/
    car/                     # Car & car image module
    discount/                # Discount rules & per-car overrides
    lead/                    # Lead module
    sale/                    # Sale module
    stats/                   # Dashboard stats module
  plugins/                   # Fastify plugins (CORS, Swagger)
  routes/                    # Standalone routes (health)
drizzle/                     # SQL migration files
frontend/                    # React frontend
  src/
    api.ts                   # API client
    types.ts                 # TypeScript types (mirrors backend)
    hooks/useCars.ts         # Data fetching hook
    components/
      CarCard.tsx            # Car card component
      Filters.tsx            # Filter bar (make, status, price, sort)
      Pagination.tsx         # Pagination controls
    App.tsx                  # Main layout
    App.css                  # Component styles
    index.css                # Global styles / CSS variables
  vite.config.ts             # Vite config with API proxy
```

## Scripts

### Backend (from root)

| Command            | Description                     |
|--------------------|---------------------------------|
| `pnpm dev`         | Start dev server (hot reload)   |
| `pnpm build`       | Compile TypeScript              |
| `pnpm start`       | Run production build            |
| `pnpm db:generate` | Generate migrations from schema |
| `pnpm db:migrate`  | Run pending migrations          |
| `pnpm db:studio`   | Open Drizzle Studio (browse DB) |

### Frontend (from `frontend/`)

| Command            | Description                          |
|--------------------|--------------------------------------|
| `pnpm dev`         | Start Vite dev server (port 5173)    |
| `pnpm build`       | Build for production                 |
| `pnpm preview`     | Preview production build locally     |

### Car Images

Upload images via the API (JPEG, PNG, or WebP, max 5MB):

```bash
curl -X POST "http://localhost:3000/cars/10/images" \
  -F "file=@/path/to/photo.png"
```

The first image uploaded to a car is automatically set as primary and displayed in the frontend.

### Discounts

The discount system has two layers. Per-car overrides take priority over rules.

**Per-car discount** -- set a fixed amount off a specific car:

```bash
# Set $2,000 off car 15
curl -X PATCH "http://localhost:3000/cars/15/discount" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000}'

# Clear the discount
curl -X PATCH "http://localhost:3000/cars/15/discount" \
  -H "Content-Type: application/json" \
  -d '{"amount": null}'
```

**Discount rules** -- apply a fixed discount to all cars matching criteria:

```bash
# $3,000 off all 2022 models
curl -X POST "http://localhost:3000/discounts" \
  -H "Content-Type: application/json" \
  -d '{"name": "2022 clearance", "amount": 3000, "maxYear": 2022}'

# $5,000 off all BMWs over $60,000
curl -X POST "http://localhost:3000/discounts" \
  -H "Content-Type: application/json" \
  -d '{"name": "BMW premium sale", "amount": 5000, "make": "BMW", "minPrice": 60000}'
```

Rule criteria fields (`make`, `minYear`, `maxYear`, `minPrice`, `maxPrice`) are all optional -- only non-null fields are evaluated. If multiple rules match a car, the highest discount wins. Every car response includes `discountAmount` and `discountedPrice` computed fields.
