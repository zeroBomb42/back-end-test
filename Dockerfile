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

# Run Prisma migration (ensure the database schema is up to date)
RUN npx prisma migrate deploy

# Build the application for production
RUN npm run build

# Stage 2: Production Stage
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app /app

# Install production dependencies
RUN npm install --only=production

# Expose the application port (if necessary)
EXPOSE 3099

# Ensure the database is connected and migrated before starting the app
CMD ["sh", "-c", "npx prisma db pull && npx prisma migrate deploy && npm run start"]
