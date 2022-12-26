import { Config, Configuration } from './Config';
import axios from 'axios';
import * as https from 'https';

interface PlexWebhook {
  event: string;
  Metadata: {
    title: string;
    art: string;
    parentTitle: string;
  };
}

interface NtfyBaseResponse {
  topic: string;
  message: string;
  title: string;
}

interface NtfyAddMediaResponse extends NtfyBaseResponse {
  attach: string;
}

export class ResponseMapper {
  private readonly configuration: Configuration;

  constructor(private readonly config: Config) {
    this.configuration = config.getConfigration();
  }

  public async createAddMediaNtfyResponse(plexHookResponse: PlexWebhook): Promise<NtfyAddMediaResponse> {
    return await new Promise<NtfyAddMediaResponse>((resolve, reject) => {
      const metadata = plexHookResponse.Metadata;
      if (metadata.art !== '' && metadata.title !== '' && metadata.parentTitle !== '') {
        const ntfyResposne: NtfyAddMediaResponse = {
          attach: metadata.art,
          title: metadata.parentTitle,
          message: metadata.title,
          topic: this.configuration.NTFY_TOPIC,
        };
        resolve(ntfyResposne);
      }
      reject(new Error('Plex Webhook Response is expected in this format'));
    });
  }

  public async sendNtfyResponse(payload: NtfyBaseResponse): Promise<void> {
    console.log(`Sending Response to ${this.configuration.NTFY_URL} topic: ${this.configuration.NTFY_TOPIC}`);
    return await axios.post(
      this.configuration.NTFY_URL,
      {
        ...payload,
      },
      {
        // Disable Cert Verification for self-signed certs
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        responseType: 'json',
      }
    );
  }
}
