FROM node:current-alpine3.20 as base
WORKDIR /usr/src/app

COPY package*.json ./

FROM base as dev 
RUN npm install
USER node
COPY . .
CMD npm run dev 


FROM base as prod
RUN npm install
USER node
COPY . .
CMD npm run start 

