# Multi-stage build for backend and frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY admin-panel/package.json admin-panel/package-lock.json ./admin-panel/
COPY employee-panel/package.json employee-panel/package-lock.json ./employee-panel/
COPY backend/package.json backend/package-lock.json ./backend/

# Install dependencies for all services
RUN npm ci
RUN cd admin-panel && npm ci
RUN cd employee-panel && npm ci
RUN cd backend && npm ci

# Build admin panel
WORKDIR /app/admin-panel
COPY admin-panel . 
RUN npm run build

# Build employee panel
WORKDIR /app/employee-panel
COPY employee-panel .
RUN npm run build

# Copy backend source
WORKDIR /app/backend
COPY backend .

# Production stage
FROM node:18-alpine

WORKDIR /app/backend

# Install only production dependencies for backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend .

# Copy built frontends from builder
COPY --from=builder /app/admin-panel/dist /app/public/admin
COPY --from=builder /app/employee-panel/dist /app/public/employee

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Start backend server
CMD ["node", "server.js"]
