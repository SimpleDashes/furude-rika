import FurudeCommand from '../../discord/commands/FurudeCommand';

export default class OsuRootCommand extends FurudeCommand {
  public constructor() {
    super({
      name: 'osu',
      description: '.',
    });
  }

  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
