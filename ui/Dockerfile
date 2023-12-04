FROM node:20

WORKDIR /shope-ui

COPY package.json yarn.lock ./

RUN yarn install

ARG PUBLIC_USERNAME_DEFAULT

ENV NODE_ENV=production \
  API_URL=http://api:3000 \
  PUBLIC_USERNAME_DEFAULT=${PUBLIC_USERNAME_DEFAULT}

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "run", "serve"]
