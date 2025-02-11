# Stage 1: Build Stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application for production
RUN npm run build

# Stage 2: Production Stage
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app /app

# Expose the application port (if necessary)
EXPOSE 3099

# Use the production start command
CMD ["npm", "run", "start"]
