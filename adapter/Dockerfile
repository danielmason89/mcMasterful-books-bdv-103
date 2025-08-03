FROM node:18

WORKDIR /app

COPY ../package.json ../package-lock.json* ./
COPY . ./

RUN npm install

CMD ["npm", "run", "dev"]