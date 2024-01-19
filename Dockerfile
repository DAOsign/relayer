FROM node:18

# Create app directory
WORKDIR /app

RUN npm install -g typescript ts-node ethers@latest

RUN yarn

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

RUN yarn install
COPY . .

RUN yarn build

ENV NODE_ENV production

EXPOSE 3000

CMD ["yarn", "start"]
