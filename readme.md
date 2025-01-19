[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Tautulli 2 ntfy.sh

A Webservice which translates a Webhook call from Tautulli to an ntfy Server.

## Features

- Receive Tautulli webhooks and pass them to NTFY
- Show Plex posters in NTFY when new media is added

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file or in the docker environment
`PORT` Port for the Webhook defaults to `3000`

`NTFY_URL` URL to NTFY Server

`NTFY_TOPIC` NTFY topic where notifications are being sent

`NTFY_TOKEN` Optional: Access token for ntfy server

`PLEX_TOKEN` Plex API token. [Click here to see how](#how-to-get-plex_token)

`NTFY_TOKEN` Plex Server URL; Server from where the Poster Thumbnails are being generated.

`IGNORE_SSL_CERT` Optional: Disable SSL cert verification

`PORT` Optional: Overwrites default port

## Deployment

To deploy this project, build the Docker Image and run with docker-compose

```bash
version: "3.0"
services:
  tautulli2ntfy:
    image: interactiveninja/tautulli-ntfy-webhook:latest
    environment:
      - NTFY_TOPIC="your topic"
      - NTFY_URL="your ntfy server"
      - PLEX_TOKEN="your poster token"
      - PLEX_URL="your poster token"
    ports:
      - 3000:3000
    restart: always

```

## Building the Docker Image yourself

```bash
  docker build . -t tautulli2ntfy
```

## Documentation

### Tautulli Webhook Config

```
{
<movie>
"title": "{title}",
"message": "Ist jetzt auf Plex verfügbar.",
</movie>

<season>
"title": "{title}",
"message": "{episode_count} Episoden wurden hinzugefügt.",
</season>

<show>
"title": "{title}",
"message": "{season_count} Staffeln wurden hinzugefügt.",
</show>

<episode>
"title": "{show_name}",
"message": "{episode_name} ist jetzt auf Plex verfügbar.",
</episode>

<artist>
"title": "{artist_name}",
"message": "Neue Tracks sind jetzt auf Plex verfügbar.",
</artist>

<track>
"title": "{artist_name}",
"message": "{track_name} ist jetzt auf Plex verfügbar.",
</track>

<album>
"title": "{artist_name}",
"message": "{album_name} ist jetzt auf Plex verfügbar.",
</album>

"media_type": "{media_type}",
"poster": "{poster_thumb}"
}
```

#### How to get `PLEX_TOKEN`

Follow the guide to get token your [Plex API Token](https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/)

Copy the value after the `X-Plex-Token=` from the URL. This is ur PLEX API Token

## Contributing

Contributions are always welcome!
