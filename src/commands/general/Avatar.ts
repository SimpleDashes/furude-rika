import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import CommandOptions from '../../containers/CommandOptions';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';
import BaseEmbed from '../../modules/framework/embeds/BaseEmbed';
import UserOption from '../../modules/framework/options/classes/UserOption';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';

export default class Avatar extends FurudeCommand {
  private readonly userOption: UserOption = this.registerOption(
    new UserOption(true)
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
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const user = this.userOption.apply(interaction)!;

      const embed = new BaseEmbed(
        {
          title: runner.args!.localizer.get(
            FurudeTranslationKeys.AVATAR_RESPONSE,
            [user.username]
          ),
          image: {
            url: user.avatarURL({ dynamic: true, size: 1024 })!,
          },
        },
        interaction
      );

      await InteractionUtils.reply(interaction, {
        embeds: [embed],
      });
    };
  }
}
