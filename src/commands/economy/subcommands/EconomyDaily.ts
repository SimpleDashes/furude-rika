import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import DBCitizen from '../../../database/entity/DBCitizen';
import FurudeOperations from '../../../database/FurudeOperations';
import EconomySubCommand, {
  EconomyRunner,
  MustHaveOpenAccount,
} from '../wrapper/EconomySubCommand';

@MustHaveOpenAccount
export default class EconomyDaily extends EconomySubCommand {
  public constructor() {
    super({
      name: 'daily',
      description: `Collect your daily ${DBCitizen.AMOUNT_DAILY} ${CurrencyContainer.CURRENCY_NAME}'s, with a special bounty when you get to a ${DBCitizen.WEEKLY_STREAK} streak!`,
    });
  }

  public createRunnerRunnableInternally(
    runner: EconomyRunner,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const citizen = await runner.getCitizen(interaction.user);
      const operation = citizen.claimDaily(runner.args!.localizer);

      await FurudeOperations.saveWhenSuccess(citizen, operation);
      await FurudeOperations.answerInteraction(interaction, operation);
    };
  }
}
