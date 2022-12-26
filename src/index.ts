import express, { Request, Response } from 'express';
import 'dotenv/config';
import { ConfigImpl } from './Config';
import { ResponseMapper } from './ResponseMapper';
import { Logger } from './Logger';

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());

const configReader = ConfigImpl.getConfig();
const ntfyResponseMapper = new ResponseMapper(configReader);
const logger = Logger.getLogger();

app.get('/status', (req: Request, res: Response) => {
  logger.info(`Receiving status check from ${req.ip}`);
  res.sendStatus(200);
});

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
