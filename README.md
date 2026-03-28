# Microservices Application

A complete full-stack microservices application built with modern technologies including React, Node.js, Express, Docker, and Kubernetes.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Ingress                             │
│                    (Nginx Ingress Controller)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌────────┐   ┌──────────┐  ┌──────────┐
   │Frontend│   │API Gateway│  │  Static  │
   │ (React)│   │ (Express)│  │   Assets  │
   └────┬───┘   └────┬─────┘  └──────────┘
        │            │
        │            ▼
        │       ┌──────────┐
        │       │   User   │
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

## 📁 Project Structure

```
microservices-app/
├── frontend/                  # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/            # Context providers (Auth)
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   └── styles/             # Global styles
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── services/
│   ├── api-gateway/            # API Gateway (Express)
│   │   ├── index.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   ├── user-service/           # User Service (Auth & Users)
│   │   ├── index.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .env.example
│   └── product-service/        # Product Service (CRUD)
│       ├── index.js
│       ├── package.json
│       ├── Dockerfile
│       └── .env.example
├── k8s/                        # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── user-service.yaml
│   ├── product-service.yaml
│   ├── api-gateway.yaml
│   ├── frontend.yaml
│   └── ingress.yaml
├── docker-compose.yml          # Docker Compose configuration
└── README.md
```

## 🚀 Features

### Frontend (React)
- Modern React with hooks
- React Router for navigation
- Styled Components for styling
- Toast notifications
- Responsive design
- JWT authentication
- Protected routes

### Backend Services
- **API Gateway**: Routes requests to appropriate services, handles CORS, security headers
- **User Service**: Authentication (JWT), user registration/login, user management
- **Product Service**: Product CRUD operations, search, filtering, pagination

### Infrastructure
- Docker containerization with multi-stage builds
- Health checks on all services
- Graceful shutdown handling
- Kubernetes deployments with rolling updates
- ConfigMaps and Secrets for configuration
- Ingress for external access

## 🛠️ Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Kubernetes cluster (for K8s deployment)
- kubectl
- Ingress controller (Nginx)

## 🐳 Running with Docker Compose

1. **Clone the repository**:
```bash
cd microservices-app
```

2. **Build and run all services**:
```bash
docker-compose up --build
```

3. **Access the application**:
   - Frontend: http://localhost
   - API Gateway: http://localhost:3000
   - User Service: http://localhost:3001
   - Product Service: http://localhost:3002

4. **Stop all services**:
```bash
docker-compose down
```

## ☸️ Deploying to Kubernetes

1. **Build Docker images** (or use a registry):
```bash
# Build all images
docker build -t microservices-app/user-service:latest ./services/user-service
docker build -t microservices-app/product-service:latest ./services/product-service
docker build -t microservices-app/api-gateway:latest ./services/api-gateway
docker build -t microservices-app/frontend:latest ./frontend

# If using Minikube
minikube image load microservices-app/user-service:latest
minikube image load microservices-app/product-service:latest
minikube image load microservices-app/api-gateway:latest
minikube image load microservices-app/frontend:latest
```

2. **Deploy to Kubernetes**:
```bash
# Apply all manifests
kubectl apply -f k8s/

# Or apply individually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/product-service.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress.yaml
```

3. **Enable Ingress (Minikube)**:
```bash
minikube addons enable ingress
```

4. **Add hosts entry** (for local development):
```bash
# Get Minikube IP
minikube ip

# Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
# Replace with your Minikube IP
192.168.49.2 microservices-app.local
192.168.49.2 api.microservices-app.local
```

5. **Access the application**:
   - Frontend: http://microservices-app.local
   - API: http://api.microservices-app.local

## 🔧 Development

### Running Services Locally

1. **Install dependencies for each service**:
```bash
cd services/user-service && npm install
cd services/product-service && npm install
cd services/api-gateway && npm install
cd frontend && npm install
```

2. **Create .env files**:
```bash
cp services/user-service/.env.example services/user-service/.env
cp services/product-service/.env.example services/product-service/.env
cp services/api-gateway/.env.example services/api-gateway/.env
```

3. **Start services** (in separate terminals):
```bash
# Terminal 1 - User Service
cd services/user-service && npm run dev

# Terminal 2 - Product Service
cd services/product-service && npm run dev

# Terminal 3 - API Gateway
cd services/api-gateway && npm run dev

# Terminal 4 - Frontend
cd frontend && npm start
```

## 📡 API Endpoints

### User Service
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /register | Register new user | No |
| POST | /login | Login user | No |
| GET | / | Get all users | Yes |
| GET | /me | Get current user | Yes |
| GET | /:id | Get user by ID | Yes |
| PUT | /:id | Update user | Yes |
| DELETE | /:id | Delete user | Yes |
| GET | /health | Health check | No |

### Product Service
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | / | Get all products (with filters) | No |
| POST | / | Create product | No |
| GET | /:id | Get product by ID | No |
| PUT | /:id | Update product | No |
| DELETE | /:id | Delete product | No |
| GET | /meta/categories | Get categories | No |
| GET | /health | Health check | No |

### API Gateway
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | API info |
| GET | /health | Health check |
| ALL | /api/users/* | User service proxy |
| ALL | /api/products/* | Product service proxy |

## 🔒 Security Features

- JWT authentication for protected routes
- Helmet.js for security headers
- CORS configuration
- Non-root Docker containers
- Security context in Kubernetes
- Resource limits and requests

## 📊 Monitoring & Health Checks

All services include:
- `/health` endpoint for health checks
- Docker HEALTHCHECK instructions
- Kubernetes liveness and readiness probes
- Graceful shutdown handling

## 🔧 Configuration

### Environment Variables

**User Service**:
- `PORT`: Server port (default: 3001)
- `JWT_SECRET`: Secret key for JWT
- `NODE_ENV`: Environment (development/production)

**Product Service**:
- `PORT`: Server port (default: 3002)
- `NODE_ENV`: Environment (development/production)

**API Gateway**:
- `PORT`: Server port (default: 3000)
- `USER_SERVICE_URL`: URL to user service
- `PRODUCT_SERVICE_URL`: URL to product service
- `NODE_ENV`: Environment (development/production)

## 🧪 Testing

### Sample Data
The product service comes with sample products:
- Laptop - $999.99
- Smartphone - $699.99
- Headphones - $199.99

### Test Accounts
Register a new account through the UI or API:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For support, jonasamidu@gmail.com or open an issue in the repository.
