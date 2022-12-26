import { NextFunction, Request, Response } from 'express';

enum PlexWebhookEvents {
  // Library
  LIB_ON_DECK = 'library.on.deck',
  LIB_NEW = 'library.new',
  // Media
  MEDIA_PAUSE = 'media.pause',
  MEDIA_PLAY = 'media.play',
  MEDIA_RATE = 'media.rate',
  MEDIA_RESUME = 'media.resume',
  MEDIA_SCROBBLE = 'media.scrobble',
  MEDIA_STOP = 'media.stop',
  // Server Owner
  ADMIN_DATABASE_BACKUP = 'admin.database.backup',
  ADMIN_DATABASE_CORRUPTED = 'admin.database.corrupted',
  ADMIN_DEVICE_NEW = 'device.new',
  ADMIN_PLAYBACK_STARTED = 'playback.started',
}
const supportedEvents = [PlexWebhookEvents.LIB_NEW];

export const supportedWebhookEvents = (request: Request, response: Response, next: NextFunction): void => {
  const { event } = request.body;

  if (supportedEvents.includes(event)) {
    next();
  } else {
    response.sendStatus(501);
  }
};
