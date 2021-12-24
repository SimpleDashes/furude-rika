import DefaultContext from '../../../client/contexts/DefaultContext';
import SnowFlakeIDEntity from '../../../database/entity/abstracts/SnowFlakeIDEntity';
import IHasPreferredLocale from '../../../database/interfaces/IHasPreferredLocale';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
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

  public entityToLocalize(
    runner: IFurudeRunner<DefaultContext>
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    return runner.args!.dbUser;
  }
}
