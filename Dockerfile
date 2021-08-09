FROM node:alpine
ENV CI=true
WORKDIR /billing-app-web
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
CMD ["npm", "run", "start"]