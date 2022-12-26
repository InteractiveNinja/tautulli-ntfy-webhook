export interface Configuration {
  NTFY_URL: string;
  NTFY_TOPIC: string;
  POSTER_TOKEN: string;
}

export interface Config {
  getConfigration: () => Configuration;
}

export class ConfigImpl {
  private static readonly instance = new ConfigImpl();
  private readonly configuration: Configuration;
  private constructor() {
    const { NTFY_URL, NTFY_TOPIC, POSTER_TOKEN } = process.env;

    if (NTFY_TOPIC != null && NTFY_URL != null && POSTER_TOKEN != null) {
      this.configuration = { NTFY_TOPIC, NTFY_URL, POSTER_TOKEN };
    } else {
      throw new Error('Configration is not set. Check .env File');
    }
  }

  public getConfigration(): Configuration {
    return this.configuration;
  }

  public static getConfig(): Config {
    return this.instance;
  }
}
