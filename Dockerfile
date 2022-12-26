FROM node:16
WORKDIR /usr/src/app
COPY . ./
RUN npm ci
RUN npm run build
RUN npm prune --production
CMD [ "node", "dist/bundle.js" ]
EXPOSE 3000