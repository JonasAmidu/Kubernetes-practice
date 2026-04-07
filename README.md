# Microservices Application

> Production-grade containerised microservices — deployed on Kubernetes with full CI/CD, observability, and rolling updates.

A complete full-stack microservices application built with modern infrastructure tooling: **React, Node.js, Express, Docker, and Kubernetes**.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Ingress Controller                  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌────────┐   ┌──────────┐  ┌──────────┐
   │Frontend│   │API Gateway│  │  Static   │
   │(React) │   │(Express) │  │  Assets   │
   └────┬───┘   └────┬─────┘  └──────────┘
        │            │
        │            ▼
        │       ┌──────────┐
        │       │  User    │
        │       │ Service  │
        │       │ (Port    │
        │       │  3001)   │
        │       └──────────┘
        │            │
        │       ┌──────────┐
        │       │ Product  │
        │       │ Service  │
        │       │ (Port    │
        │       │  3002)   │
        │       └──────────┘
        │
        ▼
   User Browser
```

## 🔑 Key DevOps Features

- **Multi-stage Docker builds** — optimised, non-root container images
- **Kubernetes orchestration** — Deployments, Services, ConfigMaps, Secrets, Ingress
- **Health checks & liveness probes** — all services expose `/health` endpoints
- **Rolling update strategy** — zero-downtime deployments
- **Nginx Ingress Controller** — external access with routing rules
- **Environment-based configuration** — `.env` management via ConfigMaps
- **Security contexts** — non-root containers, resource limits enforced
- **Docker Compose** — local dev parity with production

## 📁 Project Structure

```
microservices-app/
├── frontend/                  # React frontend
│   ├── Dockerfile             # Multi-stage build
│   ├── nginx.conf             # Reverse proxy config
│   └── package.json
├── services/
│   ├── api-gateway/           # Express API gateway
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── user-service/          # Auth & user management
│   │   ├── Dockerfile
│   │   └── .env.example
│   └── product-service/       # Product CRUD
│       ├── Dockerfile
│       └── .env.example
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── user-service.yaml
│   ├── product-service.yaml
│   ├── api-gateway.yaml
│   ├── frontend.yaml
│   └── ingress.yaml
└── docker-compose.yml
```

## 🚀 Quick Start

### Local with Docker Compose

```bash
git clone https://github.com/JonasAmidu/Kubernetes-practice.git
cd Kubernetes-practice
docker-compose up --build

# Frontend:  http://localhost
# API Gateway: http://localhost:3000
```

### Deploy to Kubernetes

```bash
# Build images
docker build -t microservices-app/user-service:latest ./services/user-service
docker build -t microservices-app/product-service:latest ./services/product-service
docker build -t microservices-app/api-gateway:latest ./services/api-gateway
docker build -t microservices-app/frontend:latest ./frontend

# Apply manifests
kubectl apply -f k8s/
minikube addons enable ingress
```

## 📡 API Endpoints

### User Service (`:3001`)
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/register` | No |
| POST | `/login` | No |
| GET | `/` | Yes |
| GET | `/me` | Yes |
| PUT | `/:id` | Yes |
| DELETE | `/:id` | Yes |

### Product Service (`:3002`)
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/` | No |
| POST | `/` | No |
| GET | `/:id` | No |
| PUT | `/:id` | No |
| DELETE | `/:id` | No |

## 🛠️ Tech Stack

<div>

| Layer | Technology |
|-------|------------|
| Frontend | React, Styled Components |
| API Gateway | Express.js |
| Auth | JWT (jsonwebtoken) |
| Containers | Docker, Docker Compose |
| Orchestration | Kubernetes (kubectl) |
| Ingress | Nginx Ingress Controller |
| Security | Helmet.js, CORS |

</div>

## 👤 Author

**Jonas Amidu** — [github.com/JonasAmidu](https://github.com/JonasAmidu) · jonasamidu@gmail.com

MIT License
