import { NextFunction, Response } from 'express';
import { Logger } from './Logger';
import { Container } from 'typedi';
import { TautulliResponse } from './interface/mediaTypes';
import { TypedRequest } from './util/typedRequest';
import { MediaTypes } from './enum/mediaTypes';

const supportedMediaTypes = [MediaTypes.EPISODE, MediaTypes.MOVIE, MediaTypes.SEASON, MediaTypes.SHOW];
const logger = Container.get(Logger);
export const supportedMediaTypesMiddleware = (
  request: TypedRequest<TautulliResponse>,
  response: Response,
  next: NextFunction
): void => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { media_type } = request.body;

  logger.verbose(`Getting Webhook Request for ${media_type}`);
  if (supportedMediaTypes.includes(media_type as MediaTypes)) {
    logger.verbose(`Passing Webhook Request for ${media_type}`);
    next();
  } else {
    logger.verbose(`Getting Webhook Request for ${media_type}, not supported`);
    response.sendStatus(501);
  }
};