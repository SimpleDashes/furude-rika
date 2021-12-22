import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultDependency from '../../client/providers/DefaultDependency';
import CommandOptions from '../../containers/CommandOptions';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';
import IRunsCommand from '../../framework/commands/interfaces/IRunsCommand';
import BaseEmbed from '../../framework/embeds/BaseEmbed';
import UserOption from '../../framework/options/classes/UserOption';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';

export default class Avatar extends FurudeCommand {
  private readonly user: UserOption = this.registerOption(
    new UserOption()
      .setName(CommandOptions.user)
      .setDescription('The user you want the avatar from.')
  );

  public constructor() {
    super({
      name: 'avatar',
      description: "Displays your's or another user Avatar.",
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultDependency>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const selectedUser = this.user.apply(interaction) ?? interaction.user;

      const embed = new BaseEmbed(
        {
          title: runner.args!.localizer.get(
            FurudeTranslationKeys.AVATAR_RESPONSE,
            {
              values: {
                args: [selectedUser.username],
              },
            }
          ),
        },
        interaction
      );

      embed.setImage(selectedUser.avatarURL({ dynamic: true, size: 1024 })!);

      await interaction.editReply({
        embeds: [embed],
      });
    };
  }
}
