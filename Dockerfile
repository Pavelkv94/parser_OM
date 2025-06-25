# Use the official Node.js image
FROM node:22

# Install dependencies for Chrome
RUN apt-get update && apt-get install -y wget libgtk-3-0 libdbus-glib-1-2 libxt6 libx11-xcb1 libxcomposite1 libasound2 libdrm2 libxdamage1 libxfixes3 libxrandr2 libxrender1 libgtk-3-0 libdbus-glib-1-2 \
    && wget https://ftp.mozilla.org/pub/firefox/releases/112.0/linux-x86_64/en-US/firefox-112.0.tar.bz2 \
    && tar xjf firefox-112.0.tar.bz2 -C /opt/ \
    && ln -s /opt/firefox/firefox /usr/local/bin/firefox \
    && rm firefox-112.0.tar.bz2 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port for NestJS
EXPOSE 3000

# Run the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
