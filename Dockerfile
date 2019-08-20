FROM node:jessie

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    libfontconfig

WORKDIR /usr/app

COPY package*json ./
RUN npm install

COPY . .
EXPOSE 80

CMD ["npm", "start"]
