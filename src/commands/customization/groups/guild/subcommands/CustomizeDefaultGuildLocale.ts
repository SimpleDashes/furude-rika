import { RequirePermissions } from '../../../../../framework/commands/decorators/PreconditionDecorators';
import FurudeTranslationKeys from '../../../../../localization/FurudeTranslationKeys';
import CustomizesLocaleSubCommand from '../../../wrapper/CustomizesLocaleSubCommand';

@RequirePermissions(['ADMINISTRATOR'])
export default class CustomizeDefaultGuildLocale extends CustomizesLocaleSubCommand {
  public override locale = this.registerOption(
    this.getLocaleOption(true).setDescription("The guild's new locale.")
  );

  public constructor() {
    super(
      'Customizes the guild to have a forced specific locale.',
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_GUILD,
      async (r, l) => {
        await r.client.db.manipulate(r.args?.dbGuild!, (o) => {
          o.preferred_locale = l;
        });
      },
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_GUILD_ANY
    );
  }
}
