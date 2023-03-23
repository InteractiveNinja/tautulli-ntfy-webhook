import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { ConfigLoader } from './config-loader';
import { ResponseMapper } from './ResponseMapper';
import { Logger } from './Logger';
import { supportedMediaTypes } from './SupportedMediaTypes';
import { Container } from 'typedi';

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

app.use(supportedMediaTypes);

app.post('/addMedia', (req: Request, res: Response) => {
  ntfyResponseMapper
    .createAddMediaNtfyResponse(req.body)
    .then(async (ntfyResponse) => await ntfyResponseMapper.sendNtfyResponse(ntfyResponse))
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err: Error) => {
      res.status(500).send(err.message);
    });
});

app.listen(PORT, () => {
  logger.info(`server started with PORT: ${PORT}`);
});
