import {
  Interaction,
  MessageEmbed,
  MessageEmbedOptions,
  User,
} from 'discord.js';
import UserType from '../enums/UserType';

export default class BaseEmbed extends MessageEmbed {
  public constructor(
    data?: MessageEmbed | MessageEmbedOptions | undefined,
    interaction?: Interaction,
    extraOption: {
      author?: User;
      currentTimeStamp?: boolean;
      defaultsTo?: UserType;
    } = {}
  ) {
    super(data);

    extraOption.defaultsTo = extraOption.defaultsTo ?? UserType.BOT;

    const guildMember =
      extraOption.defaultsTo == UserType.MEMBER
        ? interaction?.guild?.members.cache.get(interaction.user.id)
        : interaction?.guild?.me;

    if (!data?.color && guildMember) {
      this.setColor(guildMember.displayColor);
    }

    if (extraOption.currentTimeStamp) {
      this.setTimestamp(new Date());
    }

    if (extraOption.author) {
      this.author = {
        name: extraOption.author.tag,
        iconURL: extraOption.author.avatarURL({ dynamic: true }) ?? undefined,
      };
    }

    if (interaction?.client) {
      const { client } = interaction;

      const defaultText = client.user?.username;

      const args = {
        text: defaultText ?? '',
        iconURL: client.user!.avatarURL() ?? '',
      };

      if (this.footer) {
        args.text = `${this.footer.text} | ${defaultText}`;
      }

      this.footer = {
        text: args.text,
        iconURL: args.iconURL,
      };
    }
  }
}
