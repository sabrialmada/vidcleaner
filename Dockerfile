# Use an official Node runtime as the parent image
FROM node:20

# Install FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory for the backend
WORKDIR /usr/src/app/backend

# Copy backend package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend files
COPY backend/ .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the backend
CMD ["node", "server.js"]