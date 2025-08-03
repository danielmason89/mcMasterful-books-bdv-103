# 📚 Assignment 8: Horizontal Scaling — Bookstore API

This is the seventh assignment for **BDV 103: Advanced JavaScript through Node.js** at McMaster University Continuing Education. The focus of this assignment was on **horizontal scaling**, **event-driven microservices**, and **test-driven API development**, including integrating CI pipelines and generating an OpenAPI-compliant client SDK.

Assignment 8 builds on prior work by introducing three decoupled services — `warehouse`, `orders`, and `listings` — coordinated through RabbitMQ messaging and supporting independent MongoDB instances.

---

## ✅ Features Implemented

- 📦 **Warehouse Management API**
  - Manages shelf inventory and fulfills orders
  - Emits `BookStocked` events via RabbitMQ
  - Built with [tsoa](https://tsoa-community.github.io/docs/)

- 🛒 **Order Management API**
  - Create and retrieve orders via RESTful endpoints
  - Listens for `BookAdded` and `BookStocked` events to validate book inventory

- 🧾 **Listings API**
  - Handles the creation and publication of new books
  - Emits `BookAdded` events

- 📑 **OpenAPI Specification**
  - Generated via `tsoa` in each service
  - Accessible at `/docs` endpoints

- 🔁 **TypeScript Client SDK**
  - Auto-generated using [OpenAPI Generator](https://openapi-generator.tech/) with the `typescript-fetch` template

- 🧪 **Test Coverage with Vitest**
  - Includes both unit and integration tests

- 🔍 **Input Validation**
  - Enforced using [Zod](https://github.com/colinhacks/zod)

- 🧵 **RabbitMQ Messaging Layer**
  - Used for event-driven communication between services (e.g., `BookAdded`, `BookStocked`)

- 🛢️ **MongoDB Integration**
  - Each service uses its own isolated MongoDB collection with Mongoose

- 🛠️ **Code Quality Tools**
  - ESLint, Prettier, and `tsc --noEmit` for static validation

- 🚦 **CI/CD Workflow**
  - GitHub Actions pipelines for linting, formatting, type-checking, and tests

---

## 🐳 Running the Project with Docker Compose

### Prerequisites
- Docker
- Node.js (only needed for local testing or SDK generation)

### Start Services
```bash
docker compose up --build
```

The following services will be available:
- Frontend: [http://localhost:9080](http://localhost:9080)
- Warehouse API: [http://localhost:3002/docs](http://localhost:3002/docs)
- Orders API: [http://localhost:3001/docs](http://localhost:3001/docs)
- Listings API: [http://localhost:3003/docs](http://localhost:3003/docs)
- RabbitMQ Management UI: [http://localhost:15672](http://localhost:15672)

---

## 🐳 Production Deployment

To run the app using production containers from GitHub Container Registry:

### Prerequisites

- Docker installed
- Access to `ghcr.io`

### Steps

1. Clone the repo:
```bash
git clone https://github.com/danielmason/mcmasterful-books-bdv-103.git
cd mcmasterful-books-bdv-103

---

## 🧪 API Endpoints

All routes follow RESTful conventions and are documented in Swagger UI for each service.

### Listings API
- `POST /books` — Add a new book and emit `BookAdded`

### Warehouse API
- `GET /warehouse/:bookId` — View stock by shelf
- `POST /shelf` — Stock books on a shelf and emit `BookStocked`

### Orders API
- `POST /orders` — Create an order
- `GET /orders` — List all orders

---

## 🔧 OpenAPI Generation

Run the following in each service folder to regenerate the OpenAPI spec and client SDK:
```bash
npm run generate-api
```

This runs:
```bash
npx tsoa spec-and-routes
npx @openapitools/openapi-generator-cli generate -i ./src/generated/swagger.json -o ./client -g typescript-fetch
```

---

## ⚙️ Static Analysis

### Run Linter
```bash
npm run lint
```

### Auto-fix Linter Issues
```bash
npm run fix-lint
```

### Format Code
```bash
npm run format
```

### Type Check
```bash
npm run type-check
```

---

## 🧪 GitHub Actions CI

Workflow file: `.github/workflows/ci.yml`

On every push and PR:
- Lint
- Format
- Type check
- Run tests

---

## 🗂️ Project Structure (Simplified)

```
├── listings-service/
│   ├── src/
│   │   ├── messaging/            # RabbitMQ publisher
│   │   ├── models/               # Book schema
│   │   ├── controllers/          # tsoa routes
│   │   └── server.ts             # Koa server
├── orders-service/
│   └── ...
├── warehouse-service/
│   └── ...
├── docker-compose.yml
├── nginx.conf
└── README.md
```

---

## 📄 License

This project is part of a McMaster University Continuing Education course and is intended for academic use only.

---

## 👨‍💻 Author

**Daniel Mason**  
Full Stack Software Developer  
🌐 [daniel-mason.dev](https://daniel-mason.dev)
