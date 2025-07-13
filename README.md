# 📚 Assignment 7: Horizontal Scaling — Bookstore API

This is the seventh assignment for **BDV 103: Advanced JavaScript through Node.js** at McMaster University Continuing Education. The focus of this assignment was on **horizontal scaling** and **test-driven API development**, including integrating CI pipelines and generating an OpenAPI-compliant client SDK.

Assignment 7 focused on extending an existing bookstore API by introducing warehouse and order management features, building on test-driven development (TDD), and integrating CI/CD practices.

---

## ✅ Features Implemented

 📦 **Warehouse Management API**
  - Fulfills orders and manages shelf inventory
  - Built with [tsoa](https://tsoa-community.github.io/docs/)
- 🛒 **Order Management API**
  - Create and retrieve orders using RESTful endpoints
- 📑 **OpenAPI Specification**
  - Generated via `tsoa`, output to `swagger.json`
- 🔁 **TypeScript Client SDK**
  - Automatically generated using [OpenAPI Generator](https://openapi-generator.tech/) (`typescript-fetch`)
- 🧪 **Test Coverage with Vitest**
  - Covers unit tests and API-level tests using real and mock MongoDB setups
- 🔍 **Input Validation**
  - Enforced using [Zod](https://github.com/colinhacks/zod`)
- 🔧 **MongoDB Integration**
  - All persistent data is stored using [Mongoose](https://mongoosejs.com/)
- 🛠️ **Static Code Quality**
  - ESLint, Prettier, and `tsc --noEmit` used for code validation
- 🚦 **CI/CD Workflow**
  - GitHub Actions pipeline for linting, formatting, type-checking, and running tests

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ or v20+
- Docker (if using MongoDB in a container)
- MongoDB running on `mongodb://mongo:27017/booksdb`

### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
npm run start-server
```

The server will be available at:  
`http://localhost:3000`

### Start the Client

```bash
npm run start-client
```

The client will be available at:  
`http://localhost:9080`

---

## 🧪 API Endpoints

All warehouse and order routes follow RESTful principles and are documented in the Swagger UI.

### Swagger UI

Visit [http://localhost:3000/docs](http://localhost:3000/docs) for full documentation.

### Warehouse API

- `GET /warehouse/{book}`  
  Retrieve all shelves where the book is located, with the count per shelf.

### Fulfillment API

- `POST /fulfilment?orderId=...`  
  Fulfill an order by passing a list of `{ book, shelf, numberOfBooks }`.

### Orders API

- `POST /orders`  
  Create a new order by sending a list of book IDs.

- `GET /orders`  
  Retrieve a list of all orders.

---

## 🔧 OpenAPI Generation

To regenerate OpenAPI spec and client SDK:

```bash
npm run generate-api
```

This runs:

```bash
npx tsoa spec-and-routes
npx @openapitools/openapi-generator-cli generate -i ./src/generated/swagger.json -o ./client -g typescript-fetch --additional-properties=supportsES6=true,namingConvention=camelCase,apiNameSuffix=Api
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

### Run Prettier Formatting

```bash
npm run format
```

### Type Check with TypeScript

```bash
npm run type-check
```

---

## 🧪 GitHub Actions CI

This project includes a GitHub Actions workflow defined in:

```
.github/workflows/ci.yml
```

It runs on every push and pull request and performs:

- ESLint
- Prettier formatting check
- TypeScript type check
- Tests via Vitest

---

## 🗂️ Project Structure

```
├── adapter/assignment-4.ts       # Book filtering and adapter logic
├── client/                       # Generated OpenAPI client SDK
├── controllers/                 # tsoa-based route controllers
├── src/
│   ├── lib/db.ts                 # MongoDB connection
│   ├── models/book.ts           # Book schema
│   ├── data/                    # Order/Warehouse database logic
│   ├── types/                   # Shared types
│   ├── routes.ts                # All API endpoints
│   └── server.ts                # Entry point for Koa server
├── .github/workflows/ci.yml     # CI setup
├── .eslintrc.json               # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── tsconfig.json                # TypeScript config
└── package.json                 # Project metadata and scripts
```

---

## 📄 License

This project is part of a McMaster University Continuing Education course and is intended for academic use only.

---

## 👨‍💻 Author

**Daniel Mason**  
Full Stack Software Developer  
[daniel-mason.dev](https://daniel-mason.dev)
