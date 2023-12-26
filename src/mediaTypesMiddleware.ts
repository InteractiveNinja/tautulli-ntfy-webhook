import { NextFunction, Response } from 'express';
import { Logger } from './logger';
import { Container } from 'typedi';
import { TautulliResponse } from './model/responseModel';
import { TypedRequest } from './model/typedRequest';
import { MediaTypes, supportedMediaTypes } from './model/mediaTypes';

const logger = Container.get(Logger);
export const mediaTypesMiddleware = (
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
