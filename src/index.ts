import express, { Request, Response } from 'express';
import 'dotenv/config';
import { ConfigImpl } from './Config';
import { ResponseMapper } from './ResponseMapper';
import { supportedWebhookEvents } from './SupportedEvents';

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());

const configReader = ConfigImpl.getConfig();
const ntfyResponseMapper = new ResponseMapper(configReader);

app.get('status', (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use(supportedWebhookEvents);

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
  console.log(`server started at http://localhost:${PORT}`);
});
