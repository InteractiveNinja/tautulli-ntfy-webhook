import axios, { AxiosError } from 'axios';
import * as https from 'https';
import { Logger } from './Logger';
import { Configuration } from './interface/configuration';
import { ConfigLoader } from './config-loader';

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
  private readonly logger = Logger.getLogger();
  constructor(private readonly config: ConfigLoader) {
    this.configuration = config.getConfigration();
  }

  public async createAddMediaNtfyResponse(tautulliResponse: TautulliResponse): Promise<NtfyAddMediaResponse> {
    return await new Promise<NtfyAddMediaResponse>((resolve, reject) => {
      const [beforeUrl, afterUrl] = this.configuration.POSTER_TOKEN.split('~');
      if (tautulliResponse.poster != null && tautulliResponse.title != null) {
        const ntfyResposne: NtfyAddMediaResponse = {
          attach: `${beforeUrl}${tautulliResponse.poster}${afterUrl}`,
          title: tautulliResponse.title,
          topic: this.configuration.NTFY_TOPIC,
          message: tautulliResponse.name ?? '‎', // No Space Char, prevents default message from ntfy from being shown
        };
        resolve(ntfyResposne);
      } else {
        const errorMsg = 'Tautulli Webhook Response was expected in other format';
        this.logger.error(errorMsg);
        reject(new Error(errorMsg));
      }
    });
  }

  public async sendNtfyResponse(payload: NtfyBaseResponse): Promise<void> {
    this.logger.verbose(
      `Trying sending notification to ${this.configuration.NTFY_URL} with topic: ${this.configuration.NTFY_TOPIC}`
    );
    this.logger.verbose(JSON.stringify(payload));
    return await new Promise((resolve, reject) => {
      axios
        .post(
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
        )
        .then(() => {
          this.logger.verbose('Sending Successful');
          resolve();
        })
        .catch((err: AxiosError) => {
          this.logger.error(`Error sending Request to ntfy Server: ${err.message}`);
          reject(new Error(err.message));
        });
    });
  }
}
