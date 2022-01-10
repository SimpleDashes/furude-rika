import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import CommandOptions from '../../containers/CommandOptions';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';
import BooleanOption from '../../modules/framework/options/classes/BooleanOption';
import StringOption from '../../modules/framework/options/classes/StringOption';
import DeployHandler from '../../modules/framework/rest/DeployHandler';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';
import {
  Preconditions,
  SetPreconditions,
} from '../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.OwnerOnly)
export default class Deploy extends FurudeCommand {
  private readonly commandName = this.registerOption(
    new StringOption()
      .setRequired(true)
      .setName(CommandOptions.name)
      .setDescription('Name of the command to be deployed')
  );

  private readonly debug = this.registerOption(
    new BooleanOption()
      .setName(CommandOptions.debug)
      .setDescription('Deploys the command only in development server if true.')
  );

  public constructor() {
    super({
      name: 'deploy',
      description: 'deploys a discord command',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const isDebug = this.debug.apply(interaction);
      const commandName = this.commandName.apply(interaction) as string;

      await DeployHandler.deployCommand({
        client,
        commandName,
        isDebug,
        interaction,
        resFunctions: {
          onCommandNotFound: async () => {
            await InteractionUtils.reply(
              interaction,
              MessageCreator.error(
                runner.args!.localizer.get(
                  FurudeTranslationKeys.DEPLOY_COMMAND_NOT_FOUND
                )
              )
            );
          },
          onInvalidCommand: async () => {
            await InteractionUtils.reply(
              interaction,
              MessageCreator.error(
                runner.args!.localizer.get(
                  FurudeTranslationKeys.DEPLOY_COMMAND_CORRUPTED
                )
              )
            );
          },
          onError: async () => {
            await InteractionUtils.reply(
              interaction,
              MessageCreator.error(
                runner.args!.localizer.get(
                  FurudeTranslationKeys.DEPLOY_COMMAND_ERROR
                )
              )
            );
          },
          onSuccess: async () => {
            await InteractionUtils.reply(
              interaction,
              MessageCreator.success(
                runner.args!.localizer.get(
                  FurudeTranslationKeys.DEPLOY_COMMAND_SUCCESS
                )
              )
            );
          },
        },
      });
    };
  }
}
