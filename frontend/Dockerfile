FROM node:20-bullseye
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy and install dependencies using pnpm
COPY pnpm-lock.yaml package.json ./
RUN pnpm install

# Copy the rest of the application and build
COPY . .
RUN pnpm run build
