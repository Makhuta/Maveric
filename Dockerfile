FROM node:alpine

WORKDIR /mnt/Maveric/V0.2

COPY package.json .

RUN npm install

COPY . .

CMD ["node","./index.js"]