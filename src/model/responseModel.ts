export interface TautulliPayload {
  media_type: string;
  title: string;
  message?: string;
  poster: string;
}

export interface NtfyPayload {
  topic: string;
  message?: string;
  title: string;
  attach?: string;
}
