import { Connection } from 'typeorm';

export default class FurudeDB extends Connection {
  public constructor() {
    super({
      type: 'mongodb',
      url: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@furude.9zjpv.mongodb.net/furude?retryWrites=true&w=majority`,
      useNewUrlParser: true,
      synchronize: true,
      logging: true,
      useUnifiedTopology: true,
      entities: ['dist/database/entity/*.js'],
    });
  }
}
