FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Build the application for production
RUN npm run build

# Use a smaller image for the final stage
FROM node:18-alpine

WORKDIR /app

COPY --from=0 /app ./

# Use the production start command
CMD ["npm", "run", "start"]