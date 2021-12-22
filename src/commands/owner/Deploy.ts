import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import CommandOptions from '../../containers/CommandOptions';
import FurudeCommand from '../../discord/FurudeCommand';
import { OwnerOnly } from '../../framework/commands/decorators/PreconditionDecorators';
import BooleanOption from '../../framework/options/classes/BooleanOption';
import StringOption from '../../framework/options/classes/StringOption';
import DeployHandler from '../../framework/rest/DeployHandler';
import MessageFactory from '../../helpers/MessageFactory';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';

@OwnerOnly
export default class Deploy extends FurudeCommand {
  private readonly commandName = this.registerOption(
    new StringOption()
      .setName(CommandOptions.name)
      .setDescription('Name of the command to be deployed')
      .setRequired(true)
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

  public async run(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.deferReply();

    const isDebug = this.debug.apply(interaction);
    const commandName = this.commandName.apply(interaction) as string;

    await DeployHandler.deployCommand({
      client,
      commandName,
      isDebug,
      interaction,
      resFunctions: {
        onCommandNotFound: async () => {
          await interaction.editReply({
            content: MessageFactory.error(
              client.localizer.get(
                FurudeTranslationKeys.DEPLOY_COMMAND_NOT_FOUND
              )
            ),
          });
        },
        onInvalidCommand: async () => {
          await interaction.editReply({
            content: MessageFactory.error(
              client.localizer.get(
                FurudeTranslationKeys.DEPLOY_COMMAND_CORRUPTED
              )
            ),
          });
        },
        onError: async () => {
          await interaction.editReply({
            content: MessageFactory.error(
              client.localizer.get(FurudeTranslationKeys.DEPLOY_COMMAND_ERROR)
            ),
          });
        },
        onSuccess: async () => {
          await interaction.editReply({
            content: MessageFactory.success(
              client.localizer.get(FurudeTranslationKeys.DEPLOY_COMMAND_SUCCESS)
            ),
          });
        },
      },
    });
  }
}
