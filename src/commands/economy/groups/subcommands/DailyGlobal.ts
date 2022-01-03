import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../../client/FurudeRika';
import CurrencyContainer from '../../../../containers/CurrencyContainer';
import { HyperTypes } from '../../../../database/objects/hypervalues/HyperTypes';
import EconomySubCommand, {
  EconomyRunner,
} from '../../wrapper/EconomySubCommand';
import DailyHelper from '../../wrapper/DailyHelper';

export default class DailyLocal extends EconomySubCommand {
  public constructor() {
    super({
      name: 'global',
      description: `Get your daily ${CurrencyContainer.CURRENCY_NAME} globally.`,
    });
  }

  public createRunnerRunnableInternally(
    runner: EconomyRunner,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return DailyHelper.createRunnerRunnableInternally(
      runner,
      interaction,
      HyperTypes.global
    );
  }
}
