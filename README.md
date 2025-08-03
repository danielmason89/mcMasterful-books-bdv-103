# 📚 Assignment 8: Containerization & Production Deployment — Bookstore API

This is the eighth assignment for **BDV 103: Advanced JavaScript through Node.js** at McMaster University Continuing Education. The focus of this assignment was on:

- 🐳 **Containerizing services using Docker**
- 🚀 **Building and publishing Docker images to GitHub Container Registry (GHCR)**
- 🛠️ **Creating a production-grade Docker Compose deployment**
- ⚙️ **Automating builds and pushes using GitHub Actions CI**

Assignment 8 builds on prior work by turning a horizontally scaled, event-driven bookstore app into a deployable set of services with public images and production setup.

---

## ✅ Services Overview

- 📦 **Warehouse API** — Stocks and manages inventory (`BookStocked` events)
- 🛒 **Orders API** — Creates and tracks book orders
- 📚 **Listings API** — Publishes new books (`BookAdded` events)
- 🧵 **RabbitMQ** — Used for inter-service messaging
- 🛢️ **MongoDB** — Each service has its own collection
- 🌐 **Frontend** — Hosted via NGINX and served from a GitHub Container image

---

## 🐳 Local Development with Docker Compose

### Prerequisites
- Docker
- Node.js (only if using non-container tools like SDK generation)

### Start Development Setup
```bash
docker compose up --build
```

Available URLs:
- Frontend: [http://localhost:9080](http://localhost:9080)
- Listings API: [http://localhost:3003/docs](http://localhost:3003/docs)
- Warehouse API: [http://localhost:3002/docs](http://localhost:3002/docs)
- Orders API: [http://localhost:3001/docs](http://localhost:3001/docs)
- RabbitMQ: [http://localhost:15672](http://localhost:15672) (guest / guest)

---

## 🚀 Production Deployment Using GHCR Images

### Prerequisites
- Docker installed
- Access to `ghcr.io`
  - If images are private, you'll need a GitHub token with `read:packages` scope

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/danielmason/mcmasterful-books-bdv-103.git
   cd mcmasterful-books-bdv-103
   ```

2. If required, log in to GHCR:
   ```bash
   echo <your_github_pat> | docker login ghcr.io -u danielmason89 --password-stdin
   ```

3. Start production containers:
   ```bash
   docker compose -f production.docker-compose.yaml up
   ```

4. Visit the deployed app:
   - Frontend: [http://localhost:8080](http://localhost:8080)
   - All APIs and RabbitMQ should be accessible as above

---

## 🔧 Docker & GitHub Actions Setup

Each service has a dedicated `Dockerfile` and is published to **GitHub Container Registry (GHCR)** using a GitHub Actions workflow:

- 📂 `.github/workflows/docker-build-publish.yml`
- 🐙 CI builds images on push to `main` and pushes them to GHCR under `danielmason89/`

Example:
```yaml
docker build -t ghcr.io/danielmason89/listings-service ./listings-service
docker push ghcr.io/danielmason89/listings-service
```

---

## 📦 Container Registry (GHCR)

| Service            | Image URL                                                  |
|--------------------|-------------------------------------------------------------|
| Listings Service   | `ghcr.io/danielmason89/listings-service:latest`             |
| Orders Service     | `ghcr.io/danielmason89/orders-service:latest`               |
| Warehouse Service  | `ghcr.io/danielmason89/warehouse-service:latest`            |
| Frontend           | `ghcr.io/danielmason89/mcmasterful-books-docker:latest`     |

---

## 📄 API Endpoints

### Listings API
- `POST /books` — Add a new book and emit `BookAdded`

### Warehouse API
- `GET /warehouse/:bookId` — View stock by shelf
- `POST /shelf` — Stock books on a shelf and emit `BookStocked`

### Orders API
- `POST /orders` — Create an order
- `GET /orders` — List all orders

---

## 🔍 OpenAPI & Client SDK

OpenAPI specs are generated via `tsoa`, and client SDKs are built using `openapi-generator`:

```bash
npm run generate-api
```

Which runs:
```bash
npx tsoa spec-and-routes
npx @openapitools/openapi-generator-cli generate -i ./src/generated/swagger.json -o ./client -g typescript-fetch
```

---

## 🧪 Testing & CI

All services include unit and integration tests using **Vitest**.

CI pipeline validates:
- ✅ Linting (ESLint)
- ✅ Formatting (Prettier)
- ✅ Static typing (`tsc`)
- ✅ Test execution

See: `.github/workflows/ci.yml` and `.github/workflows/docker-build-publish.yml`

---

## 📁 Project Structure (Simplified)

```
├── listings-service/
├── warehouse-service/
├── orders-service/
├── nginx.conf
├── Dockerfiles (in each service)
├── docker-compose.yml
├── production.docker-compose.yaml
├── .github/workflows/
│   ├── ci.yml
│   └── docker-build-publish.yml
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
![CI](https://github.com/danielmason/mcmasterful-books-bdv-103/actions/workflows/ci.yml/badge.svg)
![Docker](https://github.com/danielmason/mcmasterful-books-bdv-103/actions/workflows/docker-build-publish.yml/badge.svg)