export interface Configuration {
  NTFY_URL: string;
  NTFY_TOPIC: string;
  NTFY_TOKEN?: string;
  POSTER_TOKEN: string;
  PORT: number;
  IGNORE_SSL_CERT: boolean;
}
