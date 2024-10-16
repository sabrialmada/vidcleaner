FROM node:20

# Install FFmpeg, Chromium, Python3, and pip
RUN apt-get update && \
    apt-get install -y ffmpeg chromium python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install youtube-dl using pip
RUN pip3 install youtube-dl && \
    youtube-dl --version

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