import 'dotenv/config';
import { Logger } from './Logger';
import { Configuration } from './interface/configuration';
import { Service } from 'typedi';

@Service()
export class ConfigLoader {
  private readonly configuration: Configuration;

  constructor(private readonly logger: Logger) {
    const { NTFY_URL, NTFY_TOPIC, NTFY_TOKEN, POSTER_TOKEN, PORT, IGNORE_SSL_CERT } = this.checkRequiredConfig();
    this.configuration = {
      NTFY_TOPIC,
      NTFY_URL,
      POSTER_TOKEN,
      PORT,
      IGNORE_SSL_CERT,
    };
  }

  public getConfigration(): Configuration {
    return this.configuration;
  }

  private checkRequiredConfig(): Configuration {
    const { NTFY_URL, NTFY_TOPIC, NTFY_TOKEN, POSTER_TOKEN, PORT, IGNORE_SSL_CERT } = process.env;

    const missingConfigurations: string[] = [];
    if (NTFY_TOPIC == null) {
      missingConfigurations.push('NTFY_TOPIC');
    }

    if (NTFY_URL == null) {
      missingConfigurations.push('NTFY_URL');
    }
    if (POSTER_TOKEN == null) {
      missingConfigurations.push('POSTER_TOKEN');
    }
    if (missingConfigurations.length !== 0) {
      const errorMsg = `Required Configration is not set. Missing: ${missingConfigurations.join(' ')}`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    return {
      NTFY_URL: NTFY_URL as string,
      NTFY_TOPIC: NTFY_TOPIC as string,
      POSTER_TOKEN: POSTER_TOKEN as string,
      PORT: PORT != null ? parseInt(PORT) : 3000,
      IGNORE_SSL_CERT: !(IGNORE_SSL_CERT == null),
      NTFY_TOKEN: NTFY_TOKEN as string
    };
  }
}
