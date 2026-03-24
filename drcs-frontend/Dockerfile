FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# We add --host so Vite exposes the app to your local browser
CMD ["npm", "run", "dev", "--", "--host"]