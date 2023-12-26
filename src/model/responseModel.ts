export interface TautulliResponse {
  media_type: string;
  title: string;
  name?: string;
  poster: string;
}

export interface NtfyResponse {
  topic: string;
  message?: string;
  title: string;
  attach?: string;
}
