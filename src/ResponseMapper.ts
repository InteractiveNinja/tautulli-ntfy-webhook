import { Config, Configuration } from './Config';

export interface PlexWebhook {
  event: string;
  Metadata: {
    title: string;
    art: string;
    parentTitle: string;
  };
}

export interface NtfyResponse {
  topic: string;
  message: string;
  title: string;
  attach: string;
}

export class ResponseMapper {
  private readonly configuration: Configuration;

  constructor(private readonly config: Config) {
    this.configuration = config.getConfigration();
  }

  public async createNtfyResponse(plexHookResponse: PlexWebhook): Promise<NtfyResponse> {
    return await new Promise<NtfyResponse>((resolve, reject) => {
      const metadata = plexHookResponse.Metadata;
      if (metadata.art !== '' && metadata.title !== '' && metadata.parentTitle !== '') {
        const ntfyResposne: NtfyResponse = {
          attach: metadata.art,
          title: metadata.parentTitle,
          message: metadata.title,
          topic: this.configuration.NTFY_TOPIC,
        };
        resolve(ntfyResposne);
      }
      reject(new Error('Plex Webhook Response is not fully met'));
    });
  }

  public async sendNtfyResponse(payload: NtfyResponse): Promise<void> {
    return await new Promise<void>((resolve) => {
      console.log(`Sending Response to ${this.configuration.NTFY_URL} topic: ${this.configuration.NTFY_TOPIC}`);
      resolve();
    });
  }
}
