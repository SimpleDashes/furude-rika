import { VercelRequest, VercelResponse } from '@vercel/node';
import { InteractionResponseType, verifyKey } from 'discord-interactions';
import getRawBody from 'raw-body';
import { Interaction } from 'discord.js';
import FurudeRika from '../src/client/FurudeRika';

const bot = new FurudeRika();

/**
 * This is used to try to emulate the bot as a serverless function
 */
export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method != 'POST') {
    return res.send({ error: 'unknown' });
  }

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = await getRawBody(req);

  const isValidRequest = verifyKey(
    rawBody,
    signature as unknown as string,
    timestamp as unknown as string,
    process.env['PUBLIC_KEY'] as unknown as string
  );

  if (!isValidRequest) {
    console.error('Invalid Request');
    return res.status(401).send({ error: 'Bad request signature ' });
  }

  const content = req.body as Interaction;

  if (content.type == 'PING') {
    return res.status(200).send({
      type: InteractionResponseType.PONG,
    });
  }

  if (content.type == 'APPLICATION_COMMAND') {
    await bot.start();
    await bot.runCommandFromInteraction(content);

    return res.status(200).send({ content: 'Command ran successfully!' });
  }

  return res.status(400).send({ error: 'Unknown.' });
};
