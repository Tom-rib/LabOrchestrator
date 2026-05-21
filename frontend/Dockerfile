FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG REACT_APP_API_BASE=http://localhost:3001
ENV REACT_APP_API_BASE=$REACT_APP_API_BASE

RUN npm run build

FROM node:18-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/dist ./

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]
