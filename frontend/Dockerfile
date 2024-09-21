FROM node:lts as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:lts-slim

ENV NODE_ENV production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
# Copy env
COPY .env.docker /usr/src/app/.env

RUN yarn install --production --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

USER node

CMD [ "node", "dist/src/main.js" ]