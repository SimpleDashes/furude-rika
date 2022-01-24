import type DefaultContext from '../../contexts/DefaultContext';
import CommandOptions from '../../containers/CommandOptions';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import { UserOption, assertDefined, InteractionUtils } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import BaseEmbed from '../../discord/embeds/BaseEmbed';

type Args = {
  user: UserOption;
};

@CommandInformation({
  name: 'avatar',
  description: "Displays your's or another user Avatar.",
})
export default class Avatar extends FurudeCommand<Args, DefaultContext<Args>> {
  public createArguments(): Args {
    return {
      user: new UserOption(true)
        .setName(CommandOptions.user)
        .setDescription('The user you want the avatar from.'),
    };
  }

  public async trigger(context: DefaultContext<Args>): Promise<void> {
    const { interaction, args, client } = context;
    const { localizer } = client;
    const { user } = args;

    assertDefined(user);

    const avatar = user.avatarURL({ dynamic: true, size: 1024 });
    assertDefined(avatar);

    const embed = new BaseEmbed(
      {
        title: localizer.getTranslationFromContext(
          context,
          (k) => k.avatar.response,
          { USER: user.username }
        ),
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
