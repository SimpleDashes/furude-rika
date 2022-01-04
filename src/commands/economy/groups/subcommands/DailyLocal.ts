import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../../client/FurudeRika';
import CurrencyContainer from '../../../../containers/CurrencyContainer';
import { HyperTypes } from '../../../../database/objects/hypervalues/HyperTypes';
import { RequiresGuild } from '../../../../framework/commands/decorators/PreconditionDecorators';
import EconomySubCommand, {
  EconomyRunner,
} from '../../wrapper/EconomySubCommand';
import DailyHelper from '../../wrapper/DailyHelper';

@RequiresGuild
export default class DailyLocal extends EconomySubCommand {
  public constructor() {
    super({
      name: 'local',
      description: `Get your daily ${CurrencyContainer.CURRENCY_NAME} for the current guild you are in.`,
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
      HyperTypes.local
    );
  }
}