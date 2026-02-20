# Car Dealership API

> **Work in progress** -- this project is under active development.

REST API for a car dealership built with Fastify and TypeScript.

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Fastify 5
- **Language:** TypeScript 5

## Getting Started

```bash
pnpm install
pnpm dev
```

The server starts at `http://localhost:3000`.

## Endpoints

| Method | Path        | Description          |
|--------|-------------|----------------------|
| GET    | /health     | Health check         |
| GET    | /cars       | List cars (paginated)|
| GET    | /cars/:id   | Get car by ID        |
| POST   | /leads      | Create a new lead    |

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

## Scripts

| Command       | Description                |
|---------------|----------------------------|
| `pnpm dev`    | Start dev server (hot reload) |
| `pnpm build`  | Compile TypeScript         |
| `pnpm start`  | Run production build       |
