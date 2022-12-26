import { Config, Configuration } from './Config';
import axios from 'axios';
import * as https from 'https';

interface TautulliResponse {
  media_type: string;
  title: string;
  name?: string;
  poster: string;
}

interface NtfyBaseResponse {
  topic: string;
  message?: string;
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

  public async createAddMediaNtfyResponse(tautulliResponse: TautulliResponse): Promise<NtfyAddMediaResponse> {
    return await new Promise<NtfyAddMediaResponse>((resolve, reject) => {
      const [beforeUrl, afterUrl] = this.configuration.POSTER_TOKEN.split('~');
      if (tautulliResponse.poster !== '' && tautulliResponse.title !== '') {
        const ntfyResposne: NtfyAddMediaResponse = {
          attach: `${beforeUrl}${tautulliResponse.poster}${afterUrl}`,
          title: tautulliResponse.title,
          topic: this.configuration.NTFY_TOPIC,
          message: tautulliResponse.name,
        };
        resolve(ntfyResposne);
      }
      reject(new Error('Tautulli Webhook Response is expected in this format'));
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
