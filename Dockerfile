FROM node:20-slim

# Install FFmpeg, Chromium, curl, and other necessary tools
RUN apt-get update && \
    apt-get install -y ffmpeg chromium curl procps && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Download and install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Verify yt-dlp installation
RUN yt-dlp --version

# Set up environment for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

# Create a non-root user
RUN useradd -m appuser

WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the backend folder
COPY backend/package*.json ./

# Install dependencies, including node-cron and bull
RUN npm install --only=production && \
    npm install node-cron bull

# Copy the backend folder content
COPY backend ./

# Change ownership of the app files to the non-root user
RUN chown -R appuser:appuser /usr/src/app

# Switch to non-root user
USER appuser

EXPOSE 5000

# Start the server
CMD ["node", "server.js"]