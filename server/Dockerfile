FROM node:latest

RUN mkdir -p /opt/app
WORKDIR /opt/app

RUN npm install nodemon -g

COPY package.json /opt/app/
RUN npm install
COPY . /opt/app

EXPOSE 9000

CMD ["npm", "run", "server"]
