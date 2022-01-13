import type DefaultContext from '../../../client/contexts/DefaultContext';
import type SnowFlakeIDEntity from '../../../database/entity/abstracts/SnowFlakeIDEntity';
import type IHasPreferredLocale from '../../../database/interfaces/IHasPreferredLocale';
import CustomizesLocaleSubCommand from '../wrapper/CustomizesLocaleSubCommand';

export default class CustomizeUserLocale extends CustomizesLocaleSubCommand {
  protected localeOption = this.registerOption(
    this.getLocaleOption().setDescription('Your preferred locale.')
  );

  public constructor() {
    super('Customizes your own preferred locale!');
  }

  public entityToLocalize(
    context: DefaultContext
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    return context.dbUser;
  }
}
