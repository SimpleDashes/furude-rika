import FurudeRika from './client/FurudeRika';
import dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      DEV_GUILD_ID: string;
      MONGODB_USER: string;
      MONGODB_PASSWORD: string;
    }
  }
}

const furudeRika = new FurudeRika();
furudeRika.start();
