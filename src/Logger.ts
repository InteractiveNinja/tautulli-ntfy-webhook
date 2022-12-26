import { Logger as WinstonLogger, createLogger, transports, format } from 'winston';
export class Logger {
  private static instance: Logger;
  private readonly logger: WinstonLogger;

  private constructor() {
    this.logger = createLogger({
      format: format.simple(),
      level: 'info',
      transports: [new transports.Console()],
    });
  }

  public static getLogger(): WinstonLogger {
    if (this.instance === undefined) {
      this.instance = new Logger();
    }

    return this.instance.logger;
  }
}
