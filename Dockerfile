# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install && yarn cache clean

# Copy source code
COPY . .

# Accept build arguments
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the application
RUN yarn build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Install only production dependencies
RUN yarn install --production && yarn cache clean

# Expose the port
ENV PORT=3002
EXPOSE 3002

# Start the application
CMD ["yarn", "start", "-p", "3002"]
