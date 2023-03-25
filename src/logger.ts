import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';
import { Service } from 'typedi';

@Service()
export class Logger {
  private readonly logger: WinstonLogger;

  constructor() {
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

  public error(msg: string): void {
    this.logger.error(msg);
  }

  public warn(msg: string): void {
    this.logger.warn(msg);
  }

  public info(msg: string): void {
    this.logger.info(msg);
  }

  public verbose(msg: string): void {
    this.logger.verbose(msg);
  }
}
