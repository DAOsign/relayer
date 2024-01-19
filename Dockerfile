FROM node:18

# Create app directory
WORKDIR /app

RUN npm install -g typescript ts-node

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn
COPY src ./src

RUN yarn build
EXPOSE 3000

CMD ["yarn", "start"]
