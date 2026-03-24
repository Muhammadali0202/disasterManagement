# Use an official, lightweight Node.js environment
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose port 5000 to the outside world
EXPOSE 5000

# The command to start your server
CMD ["node", "server.js"]