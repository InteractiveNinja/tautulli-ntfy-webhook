## Tautulli 2 ntfy.sh

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Configration .env File

`NTFY_URL` URL to NTFY Server

`NTFY_TOPIC` Topic where Notifications are sent

`POSTER_TOKEN` Token from Plex Server which returns Poster of a Library Item

`https://{server-ip}.{identifier}.plex.direct:32400/photo/:/transcode?width=720&height=1080&minSize=1&upscale=1&url=~?X-Plex-Token={plex-token}&X-Plex-Token={plex-token}`

## Tautulli Webhook

```
{
"media_type": "{media_type}",
<movie>
"title": "{library_name}",
</movie>
<episode>
"name": "{episode_name}",
"title": "{show_name}",
</episode>
"poster": "{poster_thumb}"
}
```
