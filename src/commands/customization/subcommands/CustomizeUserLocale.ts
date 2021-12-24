import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import CustomizesLocaleSubCommand from '../wrapper/CustomizesLocaleSubCommand';

export default class CustomizeUserLocale extends CustomizesLocaleSubCommand {
  protected override locale = this.registerOption(
    this.getLocaleOption().setDescription('Your preferred locale.')
  );

  public constructor() {
    super(
      'Customizes your own preferred locale!',
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_USER,
      async (r, l) =>
        await r.client.db.manipulate(r.args!.dbUser, (o) => {
          o.preferred_locale = l;
        })
    );
  }
}
