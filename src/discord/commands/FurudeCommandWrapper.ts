import {
  CacheType,
  CommandInteraction,
  PermissionResolvable,
} from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultDependency from '../../client/providers/DefaultDependency';
import IRunsCommand from '../../framework/commands/interfaces/IRunsCommand';
import CommandPrecondition from '../../framework/commands/preconditions/abstracts/CommandPrecondition';
import OwnerPrecondition from '../../framework/commands/preconditions/OwnerPrecondition';
import MessageFactory from '../../helpers/MessageFactory';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import IFurudeCommand from './interfaces/IFurudeCommand';
import IFurudeRunner from './interfaces/IFurudeRunner';

export default class FurudeCommandWrapper {
  public static async createRunner(
    command: IFurudeCommand,
    interaction: CommandInteraction<CacheType>
  ): Promise<IFurudeRunner<any>> {
    const runner: IFurudeRunner<any> = {
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
    runner.args = await command.dependencyType()(runner).get();
    runner.run = command.createRunnerRunnable(
      runner,
      runner.client as FurudeRika,
      runner.interaction
    );
    return runner;
  }

  public static async onInsufficientPermissions(
    runner: IFurudeRunner<any>,
    precondition?: CommandPrecondition,
    _missingPermissions?: PermissionResolvable
  ): Promise<void> {
    const { interaction } = runner;
    await interaction.reply({
      content: MessageFactory.error(
        precondition instanceof OwnerPrecondition
          ? runner.args!.localizer.get(
              FurudeTranslationKeys.ERRO_OWNER_ONLY_COMMAND
            )
          : runner.args!.localizer.get(
              FurudeTranslationKeys.ERROR_MISSING_PERMISSIONS
            )
      ),
    });
  }

  public static async onMissingRequiredSubCommands(
    runner: IFurudeRunner<any>
  ): Promise<void> {
    const { interaction } = runner;
    await interaction.reply({
      content: MessageFactory.error(
        runner.args!.localizer.get(
          FurudeTranslationKeys.SUBCOMMAND_MISSING_REQUIRED
        )
      ),
    });
  }

  public static defaultDependencyType(): (
    runner: IRunsCommand<FurudeRika>
  ) => DefaultDependency {
    return (runner) => new DefaultDependency(runner);
  }
}
