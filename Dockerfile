FROM node:alpine
ENV CI=true
WORKDIR /webapp
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
CMD ["npm", "run", "start"]