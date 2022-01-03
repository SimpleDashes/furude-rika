import { CommandInteraction, CacheType } from 'discord.js';
import FurudeOperations from '../../../database/FurudeOperations';
import IDatabaseOperation from '../../../database/interfaces/IDatabaseOperation';
import { HyperTypes } from '../../../database/objects/hypervalues/HyperTypes';
import { EconomyRunner } from './EconomySubCommand';

export default class DailyHelper {
  public static createRunnerRunnableInternally(
    runner: EconomyRunner,
    interaction: CommandInteraction<CacheType>,
    type: HyperTypes
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const citizen = await runner.getCitizen(interaction.user);

      const baseOperation = citizen.claimDaily(
        interaction,
        runner.args!.localizer,
        type
      );

      const operation: IDatabaseOperation = {
        ...baseOperation,
        ...{
          response: `${type.toUpperCase()}: ${baseOperation.response}`,
        },
      };

      await FurudeOperations.saveWhenSuccess(citizen, operation);
      await FurudeOperations.answerInteraction(interaction, operation);
    };
  }
}
