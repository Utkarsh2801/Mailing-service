FROM node:12

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

ENV MONGODB_URL = 
ENV PORT = 
ENV EMAIL_SERVICE =
ENV SENDER_MAIL = 
ENV SENDER_PASS = 
ENV REDIS_SERVER = 
ENV REDIS_HOST = 
ENV REDIS_PORT = 
ENV GOOGLE_APPLICATION_CREDENTIALS = 
ENV FIREBASE_DATABASE_URL = 

EXPOSE 5000

CMD ["node", "index.js"]



