import { CommandInteraction, CacheType } from 'discord.js'
import FurudeRika from '../../client/FurudeRika'
import CommandOptions from '../../containers/CommandOptions'
import FurudeCommand from '../../discord/FurudeCommand'
import BooleanOption from '../../framework/options/classes/BooleanOption'
import StringOption from '../../framework/options/classes/StringOption'
import DeployHandler from '../../framework/rest/DeployHandler'
import MessageFactory from '../../helpers/MessageFactory'

export default class Deploy extends FurudeCommand {
  private commandName: StringOption
  private debug: BooleanOption

  public constructor() {
    super({
      name: 'deploy',
      description: 'deploys a discord command',
      usage: '',
    })

    this.commandName = new StringOption()
      .setName(CommandOptions.name)
      .setDescription('Name of the command to be deployed')
      .setRequired(true)

    this.debug = new BooleanOption()
      .setName(CommandOptions.debug)
      .setDescription('Deploys the command only in development server if true.')

    this.addStringOption(this.commandName).addBooleanOption(this.debug)
  }

  public async run(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.deferReply()

    const isDebug = this.debug.apply(interaction)
    const commandName = this.commandName.apply(interaction) as string

    await DeployHandler.deployCommand({
      client,
      commandName,
      isDebug,
      interaction,
      onCommandNotFound: async () => {
        await interaction.editReply({
          content: MessageFactory.error(
            "The specified command wasn't found on my commands list."
          ),
        })
      },
      onInvalidCommand: async () => {
        await interaction.editReply({
          content: MessageFactory.error(
            'The specified command is likely corrupt.'
          ),
        })
      },
      onError: async () => {
        await interaction.editReply({
          content: MessageFactory.error(
            'Error deploying the specified command.'
          ),
        })
      },
      onSuccess: async () => {
        await interaction.editReply({
          content: MessageFactory.success(
            'Deployed the specified command successfully.'
          ),
        })
      },
    })
  }
}
