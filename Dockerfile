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

# Copy package files first to leverage Docker cache
COPY --chown=appuser:appuser backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

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