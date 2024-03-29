import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { ConfigLoader } from './configLoader';
import { mediaTypesMiddleware } from './mediaTypesMiddleware';
import { Container } from 'typedi';
import { TypedRequest } from './model/typedRequest';
import { TautulliResponse } from './model/responseModel';
import { ResponseMapper } from './responseMapper';
import { Logger } from './logger';

const app = express();

app.use(express.json());

const configReader = Container.get(ConfigLoader);
const ntfyResponseMapper = Container.get(ResponseMapper);
const logger = Container.get(Logger);

const { PORT } = configReader.getConfigration();

app.get('/status', (req: Request, res: Response) => {
  logger.info(`Receiving status check from ${req.ip}`);
  res.sendStatus(200);
});

app.use(mediaTypesMiddleware);

app.post('/addMedia', (req: TypedRequest<TautulliResponse>, res: Response) => {
  ntfyResponseMapper
    .createAddMediaNtfyResponse(req.body)
    .then(async (ntfyResponse) => await ntfyResponseMapper.sendNtfyResponse(ntfyResponse))
    .then(() => res.sendStatus(200))
    .catch((err: Error) => res.status(500).send(err.message));
});

app.listen(PORT, () => {
  logger.info(`server started with PORT: ${PORT}`);
});
