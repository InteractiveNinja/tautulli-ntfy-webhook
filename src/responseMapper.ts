import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as https from 'https';
import { Configuration } from './model/configuration';
import { EnvironmentVariablesParser } from './environmentVariablesParser';
import { Service } from 'typedi';
import { NtfyPayload, TautulliPayload } from './model/responseModel';
import { Logger } from './logger';

@Service()
export class ResponseMapper {
  private readonly configuration: Configuration;

  constructor(readonly config: EnvironmentVariablesParser, private readonly logger: Logger) {
    this.configuration = config.getConfigration();
  }

  public async createAddMediaNtfyResponse(tautulliResponse: TautulliPayload): Promise<NtfyPayload> {
    return await new Promise<NtfyPayload>((resolve, reject) => {
      const [beforeUrl, afterUrl] = this.configuration.POSTER_TOKEN.split('~');
      if (tautulliResponse.poster != null && tautulliResponse.title != null) {
        const ntfyResposne: NtfyPayload = {
          attach: `${beforeUrl}${tautulliResponse.poster}${afterUrl}`,
          title: tautulliResponse.title,
          topic: this.configuration.NTFY_TOPIC,
          message: tautulliResponse.message ?? '‎', // No Space Char, prevents default message from ntfy from being shown
        };
        resolve(ntfyResposne);
      } else {
        const errorMsg = 'Tautulli Webhook Response was expected in other format';
        reject(this.logger.error(errorMsg));
      }
    });
  }

  public async sendNtfyResponse(payload: NtfyPayload): Promise<void> {
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
          reject(this.logger.error(`Error sending Request to ntfy Server: ${err.message}`));
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

    return Object.assign(ignoreSslCertificate, authorization, responseType);
  }
}
