# ---- Stage 1: Build ----
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for efficient caching)
COPY package*.json ./

# Install all dependencies (including dev for TypeScript build)
RUN npm install

# Copy the rest of your source code
COPY . .

# Build the project (only if you use TypeScript)
RUN npm run build

# ---- Stage 2: Run ----
FROM node:18-alpine

WORKDIR /app

# Copy only built files and necessary assets from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port your app runs on
EXPOSE 5000

# Command to start the app
CMD ["node", "dist/server.js"]
