import { CommandInteraction, CacheType } from 'discord.js';

import FurudeRika from '../../../client/FurudeRika';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import FurudeOperations from '../../../database/FurudeOperations';
import EconomySubCommand, { EconomyRunner } from '../wrapper/EconomySubCommand';

export default class EconomyOpen extends EconomySubCommand {
  private static readonly STARTING_CAPITAL = 100;

  public constructor() {
    super({
      name: 'open',
      description: `Opens a ${CurrencyContainer.CURRENCY_NAME} currency account. (Starting with ${EconomyOpen.STARTING_CAPITAL} ${CurrencyContainer.CURRENCY_NAME}'s)`,
    });
  }

  public createRunnerRunnableInternally(
    runner: EconomyRunner,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const user = await runner.args!.USERS.default(interaction.user);
      const operation = user.citizen.openAccount(runner.args!.localizer);

      await FurudeOperations.saveWhenSuccess(user, operation);
      await FurudeOperations.answerInteraction(interaction, operation);
    };
  }
}
