import { CommandInteraction, CacheType } from 'discord.js'
import FurudeRika from '../../client/FurudeRika'
import FurudeCommand from '../../discord/FurudeCommand'
import BaseEmbed from '../../framework/embeds/BaseEmbed'
import UserType from '../../framework/enums/UserType'
import PingContainer from '../../framework/ping/PingContainer'
import PingData from '../../framework/ping/PingData'
import MessageFactory from '../../helpers/MessageFactory'

interface IPingCallbackArguments {
  interaction: CommandInteraction
}

class PingDataType extends PingData<IPingCallbackArguments> {
  public constructor(pingWhat: string) {
    super(pingWhat)
  }
}

class PingContainerType extends PingContainer<PingDataType> {
  public readonly discord: PingDataType

  public constructor() {
    super()
    this.discord = this.pushGet(
      new PingDataType('Discord websocket').setPingCallback(
        (args) => args.interaction.client.ws.ping
      )
    )
  }
}

export default class Ping extends FurudeCommand {
  private readonly pingContainer: PingContainerType = new PingContainerType()

  public constructor() {
    super({
      name: 'ping',
      description: 'Pings multiple servers',
      usage: '',
    })
  }

  public async run(
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.deferReply()

    const embed = new BaseEmbed({}, interaction, {
      author: interaction.user,
      defaultsTo: UserType.MEMBER,
    })

    const pingArgs: IPingCallbackArguments = {
      interaction,
    }

    this.pingContainer.InternalArray.forEach((pingData) => {
      const ping = pingData.ping?.call(pingData, pingArgs)
      const value = MessageFactory.bold(
        `> ${ping}ms to ping` ?? ' not reachable'
      )
      embed.addField(pingData.pingWhat, value)
    })

    await interaction.editReply({
      embeds: [embed],
    })
  }
}
