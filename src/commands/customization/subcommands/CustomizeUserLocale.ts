import DefaultContext from '../../../client/contexts/DefaultContext';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../../localization/SupportedFurudeLocales';
import CustomizesLocaleSubCommand from '../wrapper/CustomizesLocaleSubCommand';

export default class CustomizeUserLocale extends CustomizesLocaleSubCommand {
  protected override locale = this.registerOption(
    this.getLocaleOption().setDescription('Your preferred locale.')
  );

  public constructor() {
    super(
      'Customizes your own preferred locale!',
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_USER
    );
  }

  public override async manipulate(
    runner: IFurudeRunner<DefaultContext>,
    language: SupportedFurudeLocales | null
  ): Promise<void> {
    await runner.client.db.manipulate(runner.args!.dbUser, (o) => {
      o.preferred_locale = language;
    });
  }
}
