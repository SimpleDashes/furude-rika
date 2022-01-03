import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../../client/contexts/DefaultContext';
import FurudeRika from '../../../client/FurudeRika';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import DBCitizen from '../../../database/entity/DBCitizen';
import FurudeCommandGroup from '../../../discord/commands/FurudeCommandGroup';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import { RequiresSubCommands } from '../../../framework/commands/decorators/PreconditionDecorators';

@RequiresSubCommands
export default class EconomyDaily extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'daily',
      description: `Collect your daily ${DBCitizen.AMOUNT_DAILY} ${CurrencyContainer.CURRENCY_NAME}'s, with a special bounty when you get to a ${DBCitizen.WEEKLY_STREAK} streak!`,
    });
  }

  public createRunnerRunnable(
    _runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    _interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    throw new Error('Method not implemented.');
  }
}
