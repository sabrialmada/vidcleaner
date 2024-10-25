FROM node:20-slim

# Install FFmpeg, Chromium, curl, certificates and other necessary tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    chromium \
    curl \
    procps \
    ca-certificates \
    python3 \
    python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Update certificates
RUN update-ca-certificates

# Download and install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    yt-dlp --version

# Set up environment for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

# Create a non-root user and setup working directory
RUN useradd -m appuser && \
    mkdir -p /usr/src/app/uploads && \
    chown -R appuser:appuser /usr/src/app

WORKDIR /usr/src/app

# Copy package files first
COPY --chown=appuser:appuser backend/package*.json ./

# Install all required dependencies explicitly
RUN npm install -g npm@latest && \
    npm cache clean --force && \
    npm install --production \
    express@4.18.2 \
    node-cron@3.0.2 \
    bull@4.10.4 \
    ioredis@5.3.2 \
    fluent-ffmpeg@2.1.2 \
    multer@1.4.5-lts.1 \
    cors@2.8.5 \
    helmet@7.0.0 \
    compression@1.7.4 \
    express-rate-limit@6.9.0 \
    morgan@1.10.0 \
    mongoose@7.5.0 \
    archiver@5.3.1 \
    dotenv@16.3.1

# Copy the rest of the application
COPY --chown=appuser:appuser backend ./

# Switch to non-root user
USER appuser

EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start the server
CMD ["node", "server.js"]