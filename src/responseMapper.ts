import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as https from 'https';
import { Logger } from './Logger';
import { Configuration } from './interface/configuration';
import { ConfigLoader } from './configLoader';
import { Service } from 'typedi';
import { NtfyResponse, TautulliResponse } from './interface/mediaTypes';

@Service()
export class ResponseMapper {
  private readonly configuration: Configuration;

  constructor(readonly config: ConfigLoader, private readonly logger: Logger) {
    this.configuration = config.getConfigration();
  }

  public async createAddMediaNtfyResponse(tautulliResponse: TautulliResponse): Promise<NtfyResponse> {
    return await new Promise<NtfyResponse>((resolve, reject) => {
      const [beforeUrl, afterUrl] = this.configuration.POSTER_TOKEN.split('~');
      if (tautulliResponse.poster != null && tautulliResponse.title != null) {
        const ntfyResposne: NtfyResponse = {
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

  public async sendNtfyResponse(payload: NtfyResponse): Promise<void> {
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
          this.createRequestConfig(this.configuration.IGNORE_SSL_CERT, this.configuration.NTFY_TOKEN)
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

  private createRequestConfig(ignoreSslCert: boolean, ntfyAccessToken?: string): AxiosRequestConfig {
    // Disable Cert Verification for self-signed certs
    const ignoreSslCertificate: AxiosRequestConfig = {
      ...(ignoreSslCert && {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }),
    };
    const authorization: AxiosRequestConfig = {
      ...(ntfyAccessToken !== undefined && {
        headers: {
          Authorization: `Bearer ${ntfyAccessToken}`,
        },
      }),
    };
    const responseType: AxiosRequestConfig = {
      responseType: 'json',
    };

    return { ...ignoreSslCertificate, ...authorization, ...responseType };
  }
}
