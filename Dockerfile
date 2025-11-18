# Backend
FROM node:20-alpine AS backend-build
WORKDIR /app
COPY packages/backend/package*.json ./packages/backend/
RUN cd packages/backend && npm ci
COPY packages/backend ./packages/backend
RUN cd packages/backend && npm run build

# Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY packages/frontend/package*.json ./packages/frontend/
RUN cd packages/frontend && npm ci
COPY packages/frontend ./packages/frontend
RUN cd packages/frontend && npm run build

# Production
FROM node:20-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/packages/backend/dist ./backend/dist
COPY --from=backend-build /app/packages/backend/package*.json ./backend/
COPY --from=backend-build /app/packages/backend/data ./backend/data

# Copy frontend build
COPY --from=frontend-build /app/packages/frontend/dist ./frontend/dist

# Install production dependencies
RUN cd backend && npm ci --only=production

# Expose ports
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start backend
CMD ["node", "backend/dist/index.js"]
