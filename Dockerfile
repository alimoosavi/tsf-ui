# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with a simple Node server
FROM node:20-alpine

WORKDIR /app

# Install a static file server (serve is popular for React apps)
RUN npm install -g serve

# Copy build output from previous stage
COPY --from=build /app/build ./build

# Expose port 3000 (or 80 if you want clean URL)
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "build", "-l", "3000"]
