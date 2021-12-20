import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import CommandOptions from '../../containers/CommandOptions';
import FurudeCommand from '../../discord/FurudeCommand';
import BaseEmbed from '../../framework/embeds/BaseEmbed';
import UserOption from '../../framework/options/classes/UserOption';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';

export default class Avatar extends FurudeCommand {
  private user: UserOption = this.registerOption(
    new UserOption()
      .setName(CommandOptions.user)
      .setDescription('The user you want the avatar from.')
  );

  public constructor() {
    super({
      name: 'avatar',
      description: "Displays your's or another user Avatar.",
      usage: '',
    });
  }

  public async run(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.deferReply();

    const selectedUser = this.user.apply(interaction) ?? interaction.user;
    const avatarURL = selectedUser.avatarURL();

    const embed = new BaseEmbed(
      {
        title: client.localizer.get(FurudeTranslationKeys.AVATAR_RESPONSE, {
          values: {
            args: [selectedUser.username],
          },
        }),
      },
      interaction
    );

    if (avatarURL) {
      embed.setImage(avatarURL);
    }

    await interaction.editReply({
      embeds: [embed],
    });
  }
}
