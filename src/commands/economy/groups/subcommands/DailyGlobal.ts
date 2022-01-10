import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../../client/FurudeRika';
import CurrencyContainer from '../../../../containers/CurrencyContainer';
import { HyperTypes } from '../../../../database/objects/hypervalues/HyperTypes';
import EconomySubCommand, {
  EconomyRunner,
  MustHaveOpenAccount,
} from '../../wrapper/EconomySubCommand';
import DailyHelper from '../../wrapper/DailyHelper';
import { SetPreconditions } from '../../../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(MustHaveOpenAccount)
export default class DailyGlobal extends EconomySubCommand {
  public constructor() {
    super({
      name: 'global',
      description: `Get your daily ${CurrencyContainer.CURRENCY_NAME} globally.`,
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
      HyperTypes.global
    );
  }
}
