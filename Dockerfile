# Use the official Node.js image
FROM node:22

# Install dependencies for Chrome
RUN apt-get update && apt-get install -y wget libgtk-3-0 libdbus-glib-1-2 libxt6 libx11-xcb1 libxcomposite1 libasound2 libdrm2 libxdamage1 libxfixes3 libxrandr2 libxrender1 libgtk-3-0 libdbus-glib-1-2 \
    && wget https://ftp.mozilla.org/pub/firefox/releases/112.0/linux-x86_64/en-US/firefox-112.0.tar.bz2 \
    && tar xjf firefox-112.0.tar.bz2 -C /opt/ \
    && ln -s /opt/firefox/firefox /usr/local/bin/firefox \
    && rm firefox-112.0.tar.bz2 \
    && rm -rf /var/lib/apt/lists/*

# Add Firefox repository and install Chrome
# RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
#     echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
#     apt-get update && apt-get install -y google-chrome-stable && \
#     rm -rf /var/lib/apt/lists/*

# RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# RUN apt-get install -y ./google-chrome-stable_current_amd64.deb

# # Install ChromeDriver
# RUN wget -q https://storage.googleapis.com/chrome-for-testing-public/138.0.7204.49/linux64/chromedriver-linux64.zip && \
#     unzip chromedriver-linux64.zip && \
#     rm chromedriver-linux64.zip && \
#     mv chromedriver-linux64/chromedriver /usr/local/bin/

# Add Firefox repository and install Firefox
# RUN apt-get update && apt-get install -y firefox \
    # && rm -rf /var/lib/apt/lists/*

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

# Use Chrome in headless mode
# ENV CHROME_BIN=/usr/bin/google-chrome \
#     CHROME_PATH=/usr/bin/google-chrome

# Expose the port for NestJS
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start:prod"]
