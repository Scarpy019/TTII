FROM node:18
WORKDIR /usr/dir/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000 
# configure express to run on 80 in prod I think
EXPOSE 80
# for HTTPS
EXPOSE 443
CMD [ "node", "build/index.js" ]