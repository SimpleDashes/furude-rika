import { RequirePermissions } from '../../../../../framework/commands/decorators/PreconditionDecorators';
import FurudeTranslationKeys from '../../../../../localization/FurudeTranslationKeys';
import CustomizesLocaleSubCommand from '../../../wrapper/CustomizesLocaleSubCommand';

@RequirePermissions(['ADMINISTRATOR'])
export default class CustomizeDefaultChannelLocale extends CustomizesLocaleSubCommand {
  public override locale = this.registerOption(
    this.getLocaleOption(true).setDescription("The channel's new locale.")
  );

  public constructor() {
    super(
      'Customizes the current channel to have an specific required locale.',
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_CHANNEL,
      async (r, l) => {
        await r.client.db.manipulate(r.args?.dbChannel!, (o) => {
          o.preferred_locale = l;
        });
      },
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_CHANNEL_ANY
    );
  }
}
