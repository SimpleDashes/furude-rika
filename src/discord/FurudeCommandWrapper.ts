import {
  CacheType,
  CommandInteraction,
  PermissionResolvable,
} from 'discord.js';
import FurudeRika from '../client/FurudeRika';
import ICommand from '../framework/commands/interfaces/ICommand';
import IRunsCommand from '../framework/commands/interfaces/IRunsCommand';
import CommandPrecondition from '../framework/commands/preconditions/abstracts/CommandPrecondition';
import OwnerPrecondition from '../framework/commands/preconditions/OwnerPrecondition';
import MessageFactory from '../helpers/MessageFactory';
import FurudeTranslationKeys from '../localization/FurudeTranslationKeys';
import IFurudeCommand from './IFurudeCommand';

export default class FurudeCommandWrapper {
  public static createRunner(
    command: IFurudeCommand,
    interaction: CommandInteraction<CacheType>
  ): IRunsCommand<FurudeRika> {
    const runner: IRunsCommand<FurudeRika> = {
      interaction: interaction,
      client: interaction.client as FurudeRika,
      onInsufficientPermissions: async (
        precondition: CommandPrecondition,
        missingPermissions?: PermissionResolvable
      ) => {
        FurudeCommandWrapper.onInsufficientPermissions(
          runner,
          precondition,
          missingPermissions
        );
      },
      onMissingRequiredSubCommands: async () => {
        await FurudeCommandWrapper.onInsufficientPermissions(runner);
      },
    };
    runner.run = command.createRunnerRunnable(
      runner.client as FurudeRika,
      runner.interaction
    );
    return runner;
  }

  public static async onInsufficientPermissions<
    T extends FurudeRika,
    C extends ICommand<T, C>
  >(
    runner: IRunsCommand<T>,
    precondition?: CommandPrecondition,
    _missingPermissions?: PermissionResolvable
  ): Promise<void> {
    const { interaction, client } = runner;
    await interaction.reply({
      content: MessageFactory.error(
        await (precondition instanceof OwnerPrecondition
          ? client.localizer.get(
              FurudeTranslationKeys.ERRO_OWNER_ONLY_COMMAND,
              {
                discord: {
                  interaction,
                },
              }
            )
          : client.localizer.get(
              FurudeTranslationKeys.ERROR_MISSING_PERMISSIONS,
              {
                discord: {
                  interaction,
                },
              }
            ))
      ),
    });
  }

  public static async onMissingRequiredSubCommands(
    runner: IRunsCommand<FurudeRika>
  ): Promise<void> {
    const { interaction } = runner;
    await interaction.reply({
      content: MessageFactory.error(
        FurudeTranslationKeys.SUBCOMMAND_MISSING_REQUIRED
      ),
    });
  }
}
