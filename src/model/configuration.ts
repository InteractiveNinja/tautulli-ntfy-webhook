export enum ConfigurationKeys {
  NTFY_URL = 'NTFY_URL',
  NTFY_TOPIC = 'NTFY_TOPIC',
  NTFY_TOKEN = 'NTFY_TOKEN',
  PLEX_TOKEN = 'PLEX_TOKEN',
  PLEX_URL = 'PLEX_URL',
  PORT = 'PORT',
  IGNORE_SSL_CERT = 'IGNORE_SSL_CERT',
}

export interface Configuration {
  [ConfigurationKeys.NTFY_URL]: string;
  [ConfigurationKeys.NTFY_TOPIC]: string;
  [ConfigurationKeys.NTFY_TOKEN]?: string;
  [ConfigurationKeys.PLEX_TOKEN]: string;
  [ConfigurationKeys.PLEX_URL]: string;
  [ConfigurationKeys.PORT]?: number;
  [ConfigurationKeys.IGNORE_SSL_CERT]: boolean;
}
