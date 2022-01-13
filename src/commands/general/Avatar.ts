import type DefaultContext from '../../client/contexts/DefaultContext';
import CommandOptions from '../../containers/CommandOptions';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import BaseEmbed from '../../modules/framework/embeds/BaseEmbed';
import UserOption from '../../modules/framework/options/classes/UserOption';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';
import {
  assertDefined,
  assertDefinedGet,
} from '../../modules/framework/types/TypeAssertions';

export default class Avatar extends FurudeCommand<DefaultContext> {
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

  public async trigger(context: DefaultContext): Promise<void> {
    const { interaction, localizer } = context;

    const user = assertDefinedGet(this.userOption.apply(interaction));

    const avatar = user.avatarURL({ dynamic: true, size: 1024 });
    assertDefined(avatar);

    const embed = new BaseEmbed(
      {
        title: localizer.get(FurudeTranslationKeys.AVATAR_RESPONSE, [
          user.username,
        ]),
        image: {
          url: avatar,
        },
      },
      interaction
    );

    await InteractionUtils.reply(interaction, {
      embeds: [embed],
    });
  }
}
