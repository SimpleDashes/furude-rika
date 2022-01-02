import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyKey } from 'discord-interactions';
import getRawBody from 'raw-body';
import { Interaction } from 'discord.js';
import FurudeRika from '../src/client/FurudeRika';

const bot = new FurudeRika();

export default async (req: VercelRequest, res: VercelResponse) => {
  await bot.start();

  if (req.method != 'POST') {
    return res.send({ error: 'unknown' });
  }

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = await getRawBody(req);

  const isValidRequest = verifyKey(
    rawBody,
    signature as unknown as string,
    timestamp as unkown as string,
    process.env.PUBLIC_KEY
  );

  if (!isValidRequest) {
    console.error('Invalid Request');
    return res.status(401).send({ error: 'Bad request signature ' });
  }

  const content = req.body as Interaction;

  if (content.type == 'APPLICATION_COMMAND') {
    await bot.runCommandFromInteraction(content);
  }

  return res.status(200).send('Command ran successfully!');
};
