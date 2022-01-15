import type DefaultContext from '../../../client/contexts/DefaultContext';
import type SnowFlakeIDEntity from '../../../database/entity/abstracts/SnowFlakeIDEntity';
import type IHasPreferredLocale from '../../../database/interfaces/IHasPreferredLocale';
import type { TypedArgs } from '../../../modules/framework/commands/decorators/ContextDecorators';
import type { BaseLanguageChangeArgs } from '../wrapper/CustomizesLocaleSubCommand';
import CustomizesLocaleSubCommand from '../wrapper/CustomizesLocaleSubCommand';

export default class CustomizeUserLocale extends CustomizesLocaleSubCommand {
  public override createArgs(): BaseLanguageChangeArgs {
    return ((): BaseLanguageChangeArgs => {
      const args = super.createArgs();
      args.locale.setDescription('Your preferred locale.');
      return args;
    })();
  }

  public constructor() {
    super('Customizes your own preferred locale!');
  }

  public entityToLocalize(
    context: DefaultContext<TypedArgs<BaseLanguageChangeArgs>>
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    return context.dbUser;
  }
}
