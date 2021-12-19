import {
  Interaction,
  MessageEmbed,
  MessageEmbedOptions,
  User,
} from 'discord.js'
import UserType from '../enums/UserType'

export default class BaseEmbed extends MessageEmbed {
  public constructor(
    data?: MessageEmbed | MessageEmbedOptions | undefined,
    interaction?: Interaction,
    extraOption: {
      author?: User
      currentTimeStamp?: boolean
      defaultsTo?: UserType
    } = {}
  ) {
    super(data)

    extraOption.defaultsTo = extraOption.defaultsTo ?? UserType.BOT

    const guildMember =
      extraOption.defaultsTo == UserType.MEMBER
        ? interaction?.guild?.members.cache.get(interaction.user.id)
        : interaction?.guild?.me

    if (!data?.color && guildMember) {
      this.setColor(guildMember.displayColor)
    }

    if (extraOption.currentTimeStamp) {
      this.setTimestamp(new Date())
    }

    if (extraOption.author) {
      this.setAuthor(
        extraOption.author.tag,
        extraOption.author.avatarURL({ dynamic: true }) ?? undefined
      )
    }
  }
}
