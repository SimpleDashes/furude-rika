import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../../client/FurudeRika';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';
import IFurudeRunner from '../../../../discord/commands/interfaces/IFurudeRunner';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class CustomizeGuild extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'guild',
      description:
        'Customizes things related to your guild. (TL;DR GIMME DATA!!!!)',
    });
  }
  public createRunnerRunnable(
    _runner: IFurudeRunner<any>,
    _client: FurudeRika,
    _interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    throw new Error('Method not implemented.');
  }
}
