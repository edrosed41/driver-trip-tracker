FROM node:12-alpine

WORKDIR /opt/app

ENV PORT=80

# daemon for cron jobs
RUN echo 'crond' > /boot.sh
# RUN echo 'crontab .openode.cron' >> /boot.sh

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY package*.json ./
RUN npm install @vue/cli@ -g
RUN npm install @vue/cli-service
RUN npm install

# Bundle app source
COPY . .

CMD sh /boot.sh && npm start