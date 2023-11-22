FROM node:20

WORKDIR /shope-ui

COPY package.json yarn.lock ./

RUN yarn install

ARG PUBLIC_API_URL \
  PUBLIC_USERNAME_DEFAULT

ENV NODE_ENV=production \
  API_URL=http://api:3000 \
  PUBLIC_API_URL=${PUBLIC_API_URL} \
  PUBLIC_USERNAME_DEFAULT=${PUBLIC_USERNAME_DEFAULT}

COPY . .

RUN yarn build

EXPOSE 5173

CMD ["yarn", "start"]
