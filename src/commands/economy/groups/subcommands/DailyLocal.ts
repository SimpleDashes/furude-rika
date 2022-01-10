import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../../client/FurudeRika';
import CurrencyContainer from '../../../../containers/CurrencyContainer';
import { HyperTypes } from '../../../../database/objects/hypervalues/HyperTypes';
import EconomySubCommand, {
  EconomyRunner,
  MustHaveOpenAccount,
} from '../../wrapper/EconomySubCommand';
import DailyHelper from '../../wrapper/DailyHelper';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.GuildOnly, MustHaveOpenAccount)
export default class DailyLocal extends EconomySubCommand {
  public constructor() {
    super({
      name: 'local',
      description: `Get your daily ${CurrencyContainer.CURRENCY_NAME} for the current guild you are in.`,
    });
  }

  public createRunnerRunnable(
    runner: EconomyRunner,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return DailyHelper.createRunnerRunnable(
      runner,
      interaction,
      HyperTypes.local
    );
  }
}
