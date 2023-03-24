export interface TautulliResponse {
  media_type: string;
  title: string;
  name?: string;
  poster: string;
}

export interface NtfyBaseResponse {
  topic: string;
  message?: string;
  title: string;
}

export interface NtfyAddMediaResponse extends NtfyBaseResponse {
  attach: string;
}
