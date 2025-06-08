# 📚 Assignment 4: Supporting the Warehouse — Bookstore API

This is the fourth assignment for **BDV 103: Advanced JavaScript through Node.js** at McMaster University Continuing Education. The objective was to add tests to our CI pipeline and use them to help us build and design an initial API for the McMasterful Books warehouse.

## ✅ Features Implemented

- **Advanced Filtering API** for listing books by:
  - Price range (`from`, `to`)
  - Partial match on book name or author
- **Robust Input Validation** using [Zod](https://github.com/colinhacks/zod)
- **MongoDB Integration** with [Mongoose](https://mongoosejs.com/)
- **Modular Routing** using [Koa](https://koajs.com/)
- **Static Code Analysis**:
  - Linting with ESLint
  - Formatting with Prettier
  - Type checking with TypeScript
- **Continuous Integration (CI)** with GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ or v20+
- Docker (if using MongoDB in a container)
- MongoDB running on `mongodb://mongo:27017/booksdb`

### Install Dependencies

```
npm install
```

### Start the Server

```
npm run start-server
```

The server will be available at:  
`http://localhost:3000`

### Start the Client

```
mcmasterful-books
```

The client will be available at:  
`http://localhost:9080`


## 🧪 API Endpoints

### `GET /`

Health check.

---

### `GET /books?filters=[]`

Returns books matching one or more filter criteria. Example:

```
GET /books?filters=[{"from":10,"to":30},{"author":"tolkien"}]
```

#### Filter Fields

- `from`: minimum price  
- `to`: maximum price  
- `name`: substring match (case-insensitive)  
- `author`: substring match (case-insensitive)

---

### `POST /books`

Create a new book.

#### Example Body

```
{
  "name": "Dune",
  "author": "Frank Herbert",
  "description": "Sci-fi epic",
  "price": 19.99,
  "image": "https://example.com/dune.jpg"
}
```

---

### `PUT /books`

Update an existing book by ID.

```
{
  "id": "664f9b4...",
  "name": "Updated Name",
  "price": 14.99
}
```

---

### `DELETE /books/:id`

Delete a book by its ID.

---

## ⚙️ Static Analysis

### Run Linter

```
npm run lint
```

### Auto-fix Linter Issues

```
npm run fix-lint
```

### Run Prettier Formatting

```
npm run format
```

### Type Check with TypeScript

```
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

---

## 🗂️ Project Structure

```
├── adapter/assignment-3.ts       # Book filtering and adapter logic
├── src/
│   ├── lib/db.ts                 # MongoDB connection
│   ├── models/book.ts           # Book schema
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