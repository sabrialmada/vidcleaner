FROM node:20

# Install FFmpeg, Chromium, and curl
RUN apt-get update && \
    apt-get install -y ffmpeg chromium curl && \
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

WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the backend folder
COPY backend/package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the backend folder content
COPY backend ./

EXPOSE 5000

# Start the server
CMD ["node", "server.js"]