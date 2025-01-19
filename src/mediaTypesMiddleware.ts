import { NextFunction, Response } from 'express';
import { Logger } from './logger';
import { Container } from 'typedi';
import { TautulliPayload } from './model/responseModel';
import { TypedRequest } from './model/typedRequest';
import { MediaTypes } from './model/mediaTypes';
import _ from 'lodash';

const logger = Container.get(Logger);

export const mediaTypesMiddleware = (
  request: TypedRequest<TautulliPayload>,
  response: Response,
  next: NextFunction
): void => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { media_type } = request.body;

  logger.verbose(`Webhook Request for ${media_type}`);
  if (_.values(MediaTypes).includes(media_type as MediaTypes)) {
    logger.verbose(`Passing Webhook Request for ${media_type}`);
    next();
  } else {
    logger.warn(`Webhook Request for ${media_type}, is not supported`);
    response.sendStatus(501);
  }
};
