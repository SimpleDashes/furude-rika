import FurudeRika from './client/FurudeRika'
import dotenv from 'dotenv'

dotenv.config()

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string
      DEV_GUILD_ID: string
    }
  }
}

const furudeRika = new FurudeRika()
furudeRika.start()
