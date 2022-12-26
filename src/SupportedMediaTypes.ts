import { NextFunction, Request, Response } from 'express';
import { Logger } from './Logger';

enum MediaTypes {
  MOVIE = 'movie',
  SHOW = 'show',
  SEASON = 'season',
  EPISODE = 'episode',
  ARTIST = 'artist',
  TRACK = 'track',
  ALBUM = 'album',
}

const supportedMediaTypesArray = [MediaTypes.EPISODE, MediaTypes.MOVIE];
const logger = Logger.getLogger();
export const supportedMediaTypes = (
  request: Request<{ media_type: string }>,
  response: Response,
  next: NextFunction
): void => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const media_type: string = request.body.media_type;

  logger.verbose(`Getting Webhook Request for ${media_type}`);
  if (supportedMediaTypesArray.includes(media_type as MediaTypes)) {
    logger.verbose(`Passing Webhook Request for ${media_type}`);
    next();
  } else {
    logger.verbose(`Getting Webhook Request for ${media_type}, not supported`);
    response.sendStatus(501);
  }
};
