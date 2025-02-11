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

# Install postgresql-client (for migration)
RUN apk add --no-cache postgresql-client

# Expose the application port (if necessary)
EXPOSE 3099

# Add entrypoint script to check database status before migration
COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Use entrypoint script to handle migration and start
ENTRYPOINT ["entrypoint.sh"]
CMD ["npm", "run", "start"]
