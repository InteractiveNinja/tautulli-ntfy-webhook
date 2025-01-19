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

  public createAddMediaNtfyPayload(tautulliResponse: TautulliPayload): Promise<NtfyPayload> {
    return new Promise<NtfyPayload>((resolve, reject) => {
      const { PLEX_TOKEN, PLEX_URL } = this.configuration;
      const posterUrl = this.createPosterUrl(PLEX_URL, tautulliResponse, PLEX_TOKEN);

      if (tautulliResponse.poster != null && tautulliResponse.title != null) {
        const ntfyPayload: NtfyPayload = {
          attach: posterUrl,
          title: tautulliResponse.title,
          topic: this.configuration.NTFY_TOPIC,
          message: tautulliResponse.message ?? '‎', // No Space Char, prevents default message from ntfy from being shown
        };
        resolve(ntfyPayload);
      } else {
        const errorMessage = 'Tautulli Webhook Response was expected in other format';
        this.logger.error(errorMessage);
        reject(new Error(errorMessage));
      }
    });
  }

  private createPosterUrl(PLEX_URL: string, tautulliResponse: TautulliPayload, PLEX_TOKEN: string): string {
    return `${PLEX_URL}/photo/:/transcode?width=720&height=1080&minSize=1&upscale=1&url=${tautulliResponse.poster}?X-Plex-Token=${PLEX_TOKEN}&X-Plex-Token=${PLEX_TOKEN}`;
  }

  public sendNtfyResponse(payload: NtfyPayload): Promise<void> {
    this.logger.verbose(
      `Trying sending notification to ${this.configuration.NTFY_URL} with topic: ${this.configuration.NTFY_TOPIC}`
    );
    this.logger.verbose(JSON.stringify(payload));
    return axios
      .post(
        this.configuration.NTFY_URL,
        {
          ...payload,
        },
        this.createRequestConfig(this.configuration.IGNORE_SSL_CERT, this.configuration.NTFY_TOKEN)
      )
      .then(() => {
        this.logger.verbose('Sending Successful');
      })
      .catch((err: AxiosError) => {
        this.logger.error(`Error sending Request to ntfy Server: ${err.message}`);
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
