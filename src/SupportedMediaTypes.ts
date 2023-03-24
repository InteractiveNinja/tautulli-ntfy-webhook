import { NextFunction, Response } from 'express';
import { Logger } from './Logger';
import { Container } from 'typedi';
import { TautulliResponse } from './interface/media-types';
import { TypedRequest } from './util/typed-request';

enum MediaTypes {
  MOVIE = 'movie',
  SHOW = 'show',
  SEASON = 'season',
  EPISODE = 'episode',
  ARTIST = 'artist',
  TRACK = 'track',
  ALBUM = 'album',
}

const supportedMediaTypesArray = [MediaTypes.EPISODE, MediaTypes.MOVIE, MediaTypes.SEASON, MediaTypes.SHOW];
const logger = Container.get(Logger);
export const supportedMediaTypes = (
  request: TypedRequest<TautulliResponse>,
  response: Response,
  next: NextFunction
): void => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { media_type } = request.body;

  logger.verbose(`Getting Webhook Request for ${media_type}`);
  if (supportedMediaTypesArray.includes(media_type as MediaTypes)) {
    logger.verbose(`Passing Webhook Request for ${media_type}`);
    next();
  } else {
    logger.verbose(`Getting Webhook Request for ${media_type}, not supported`);
    response.sendStatus(501);
  }
};
