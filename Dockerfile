FROM node:20-alpine
WORKDIR /app

# Install frontend dependencies
COPY package*.json ./
RUN npm install --registry=https://registry.npmmirror.com

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --registry=https://registry.npmmirror.com

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start both backend and frontend
CMD ["sh", "-c", "node backend/index.js & npm start"]
