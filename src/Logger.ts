import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';

export class Logger {
  private static instance: Logger;
  private readonly logger: WinstonLogger;

  private constructor() {
    const myFormat = format.printf(({ level, message, timestamp }) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${timestamp}: [${level}] ${message}`;
    });

    this.logger = createLogger({
      format: format.combine(format.timestamp(), myFormat),
      level: 'info',
      transports: [],
    });

    if (process.env.NODE_ENV === 'production') {
      this.logger.add(new transports.Console());
    } else {
      this.logger.add(new transports.Console({ level: 'verbose' }));
      this.logger.verbose('Verbose Logging enabled');
    }
  }

  public static getLogger(): WinstonLogger {
    if (this.instance === undefined) {
      this.instance = new Logger();
    }

    return this.instance.logger;
  }
}
