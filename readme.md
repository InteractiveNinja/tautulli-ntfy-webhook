[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Tautulli 2 ntfy.sh

A Webservice which translates a Webhook call from Tautulli to an ntfy Server.

## Features

- Send Tautulli Webhooks to ntfy
- Free choice of ntfy topic
- Send Poster URL for Webhook request

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file or in the docker environment

`PORT` Port for the Webhook defaults to `3000`

`NTFY_URL` URL to NTFY Server

`NTFY_TOPIC` Topic where notifications are sent

`POSTER_TOKEN` Token for creating a Poster Link

## Building the Docker Image

```bash
  docker build . -t tautulli2ntfy
```

## Deployment

To deploy this project, build the Docker Image and run with docker-compose

```bash
version: "3.0"
services:
  tautulli2ntfy:
    image: tautulli2ntfy
    environment:
      - NTFY_TOPIC="your topic"
      - NTFY_URL="your ntfy server"
      - POSTER_TOKEN="your poster token"
    ports:
      - 3000:3000
    restart: always
```

## Documentation

`TODO`

## Appendix

#### How to create a `POSTER_TOKEN` URL

`TODO`

## Contributing

Contributions are always welcome!
