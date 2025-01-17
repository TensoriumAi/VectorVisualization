# Use the official Node.js LTS image
FROM node:18-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm install

COPY . .

# Build the client
RUN npm run build

# Development stage
FROM base AS development
CMD ["npm", "run", "dev"]

# Test stage
FROM base AS test
CMD ["npm", "test"]

# Production stage
FROM base AS production
CMD ["npm", "start"]

EXPOSE 5010