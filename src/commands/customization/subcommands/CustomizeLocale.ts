import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import DefaultDependency from '../../../client/providers/DefaultDependency';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import IRunsCommand from '../../../framework/commands/interfaces/IRunsCommand';
import Constructor from '../../../framework/interfaces/Constructor';
import StringOption from '../../../framework/options/classes/StringOption';
import MessageFactory from '../../../helpers/MessageFactory';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../../localization/SupportedFurudeLocales';

export default class extends FurudeSubCommand {
  locale = this.registerOption(
    new StringOption()
      .setName('locale')
      .setDescription('Your preferred locale')
      .setRequired(true)
      .addChoices(Object.keys(SupportedFurudeLocales).map((l) => [l, l]))
  );

  public constructor() {
    super({
      name: 'locale',
      description: 'Personalizes your own preferred locale!',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultDependency>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const preferredLocale =
        SupportedFurudeLocales[
          this.locale.apply(interaction)! as SupportedFurudeLocales
        ];

      const furudeUser = await client.db.getFurudeUser(interaction.user);
      await client.db.manipulate(furudeUser, (user) => {
        user.preferred_locale = preferredLocale;
      });

      await interaction.editReply({
        content: MessageFactory.success(
          runner.args!.localizer.get(
            FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE,
            {
              values: {
                args: [preferredLocale],
              },
            }
          )
        ),
      });
    };
  }
}