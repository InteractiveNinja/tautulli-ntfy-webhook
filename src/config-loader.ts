import 'dotenv/config';
import { Logger } from './Logger';
import { Configuration } from './interface/configuration';

export class ConfigLoader {
  private static readonly instance = new ConfigLoader();
  private readonly configuration: Configuration;
  private readonly logger = Logger.getLogger();

  private constructor() {
    const { NTFY_URL, NTFY_TOPIC, POSTER_TOKEN, PORT } = this.checkRequiredConfig();
    this.configuration = {
      NTFY_TOPIC,
      NTFY_URL,
      POSTER_TOKEN,
      PORT,
    };
  }

  public static getInstance(): ConfigLoader {
    return this.instance;
  }

  public getConfigration(): Configuration {
    return this.configuration;
  }

  private checkRequiredConfig(): Configuration {
    const { NTFY_URL, NTFY_TOPIC, POSTER_TOKEN, PORT } = process.env;

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
    };
  }
}
