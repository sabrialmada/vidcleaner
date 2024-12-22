FROM node:20-slim

# install ffmpeg, chromium, curl, and other tools
RUN apt-get update && \
    apt-get install -y ffmpeg chromium curl procps && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# download and install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# verify yt-dlp installation
RUN yt-dlp --version

# environment for puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

# create a non-root user
RUN useradd -m appuser

WORKDIR /usr/src/app

# copy package.json and package-lock.json from the backend folder
COPY backend/package*.json ./

# install dependencies, including node-cron, bull, and sendgrid
RUN npm install --only=production && \
    npm install node-cron bull @sendgrid/mail

# copy the backend folder content
COPY backend ./

# change ownership of the app files to the non-root user
RUN chown -R appuser:appuser /usr/src/app

# switch to non-root user
USER appuser

EXPOSE 5000

# start server
CMD ["node", "server.js"]