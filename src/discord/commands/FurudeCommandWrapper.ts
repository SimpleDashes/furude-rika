import {
  CacheType,
  CommandInteraction,
  PermissionResolvable,
} from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import IRunsCommand from '../../modules/framework/commands/interfaces/IRunsCommand';
import CommandPrecondition from '../../modules/framework/commands/preconditions/abstracts/CommandPrecondition';
import OwnerPrecondition from '../../modules/framework/commands/preconditions/OwnerPrecondition';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import IFurudeCommand from './interfaces/IFurudeCommand';
import IFurudeRunner from './interfaces/IFurudeRunner';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';

export default class FurudeCommandWrapper {
  public static async createRunner(
    command: IFurudeCommand,
    interaction: CommandInteraction<CacheType>
  ): Promise<IFurudeRunner<any>> {
    const runner: IFurudeRunner<DefaultContext> = {
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
      onMissingRequiredGuild: async () => {
        await this.onMissingRequiredGuild(runner);
      },
    };
    runner.args = await command.ContextType()(runner).get();
    runner.run = async () => {
      await runner.interaction.deferReply();
      runner.args!.dbUser!.incrementExperience(
        runner.interaction.user,
        runner.interaction.inGuild()
          ? {
              rawGuild: runner.interaction.guild!,
              dbGuild: runner.args!.dbGuild!,
            }
          : undefined
      );
      await command.createRunnerRunnable(
        runner,
        runner.client as FurudeRika,
        runner.interaction
      )();
    };
    return runner;
  }

  public static async onMissingRequiredGuild(
    runner: IFurudeRunner<DefaultContext>
  ) {
    await InteractionUtils.reply(
      runner.interaction,
      MessageCreator.error(
        runner.args!.localizer.get(FurudeTranslationKeys.ERROR_REQUIRES_GUILD)
      )
    );
  }

  public static async onInsufficientPermissions(
    runner: IFurudeRunner<DefaultContext>,
    precondition?: CommandPrecondition,
    _missingPermissions?: PermissionResolvable
  ): Promise<void> {
    await InteractionUtils.reply(
      runner.interaction,
      MessageCreator.error(
        precondition instanceof OwnerPrecondition
          ? runner.args!.localizer.get(
              FurudeTranslationKeys.ERRO_OWNER_ONLY_COMMAND
            )
          : runner.args!.localizer.get(
              FurudeTranslationKeys.ERROR_MISSING_PERMISSIONS
            )
      )
    );
  }

  public static async onMissingRequiredSubCommands(
    runner: IFurudeRunner<DefaultContext>
  ): Promise<void> {
    await InteractionUtils.reply(
      runner.interaction,
      MessageCreator.error(
        runner.args!.localizer.get(
          FurudeTranslationKeys.SUBCOMMAND_MISSING_REQUIRED
        )
      )
    );
  }

  public static defaultDependencyType(): (
    runner: IRunsCommand<FurudeRika>
  ) => DefaultContext {
    return (runner) => new DefaultContext(runner);
  }
}
