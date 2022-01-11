import DefaultContext from '../../../../../client/contexts/DefaultContext';
import SnowFlakeIDEntity from '../../../../../database/entity/abstracts/SnowFlakeIDEntity';
import IHasPreferredLocale from '../../../../../database/interfaces/IHasPreferredLocale';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/commands/decorators/PreconditionDecorators';
import CustomizesServerRelatedLocaleSubCommand from '../../../wrapper/CustomizesServerRelatedLocaleSubCommand';

@SetPreconditions(Preconditions.WithPermission('MANAGE_CHANNELS'))
export default class CustomizeDefaultChannelLocale extends CustomizesServerRelatedLocaleSubCommand {
  protected override localeOption = this.registerOption(
    this.getLocaleOption().setDescription("The channel's new locale.")
  );

  public constructor() {
    super(
      'Customizes the current channel to have an specific required locale.'
    );
  }

  public entityToLocalize(
    context: DefaultContext
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    return context.dbChannel!;
  }
}
