import 'reflect-metadata';

import FurudeRika from './client/FurudeRika';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      DEV_GUILD_ID: string;
      DATABASE_URL: string;
      BANCHO_API_KEY: string;
    }
  }
}

const rika = new FurudeRika();
void rika.login();
