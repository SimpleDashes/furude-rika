import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import type DefaultContext from '../../../contexts/DefaultContext';
import type SnowFlakeIDEntity from '../../../database/entity/abstracts/SnowFlakeIDEntity';
import type IHasPreferredLocale from '../../../database/interfaces/IHasPreferredLocale';
import type { BaseLanguageChangeArgs } from '../wrapper/CustomizesLocaleSubCommand';
import CustomizesLocaleSubCommand from '../wrapper/CustomizesLocaleSubCommand';

@CommandInformation({
  name: CustomizesLocaleSubCommand.LOCALE_NAME,
  description: 'Customizes your own preferred locale!',
})
export default class CustomizeUserLocale extends CustomizesLocaleSubCommand {
  public override createArguments(): BaseLanguageChangeArgs {
    return ((): BaseLanguageChangeArgs => {
      const args = super.createArguments();
      args.locale.setDescription('Your preferred locale.');
      return args;
    })();
  }

  public entityToLocalize(
    context: DefaultContext<BaseLanguageChangeArgs>
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    return context.dbUser;
  }
}
