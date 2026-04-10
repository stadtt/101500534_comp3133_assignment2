FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app source.
COPY . .

EXPOSE 4000

CMD ["npm", "start"]

