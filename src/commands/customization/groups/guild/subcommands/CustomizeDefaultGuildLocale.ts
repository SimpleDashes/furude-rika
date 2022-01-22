import { CommandPreconditions, Preconditions, assertDefined } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import type DefaultContext from '../../../../../contexts/DefaultContext';
import type SnowFlakeIDEntity from '../../../../../database/entity/abstracts/SnowFlakeIDEntity';
import type IHasPreferredLocale from '../../../../../database/interfaces/IHasPreferredLocale';
import type { BaseLanguageChangeArgs } from '../../../wrapper/CustomizesLocaleSubCommand';
import CustomizesLocaleSubCommand from '../../../wrapper/CustomizesLocaleSubCommand';
import CustomizesServerRelatedLocaleSubCommand from '../../../wrapper/CustomizesServerRelatedLocaleSubCommand';

@CommandPreconditions(Preconditions.WithPermission('MANAGE_GUILD'))
@CommandInformation({
  name: CustomizesLocaleSubCommand.LOCALE_NAME,
  description: 'Customizes the guild to have a forced specific locale.',
})
export default class CustomizeDefaultGuildLocale extends CustomizesServerRelatedLocaleSubCommand {
  public override createArguments(): BaseLanguageChangeArgs {
    return ((): BaseLanguageChangeArgs => {
      const args = super.createArguments();
      args.locale.setDescription("The guild's new locale.");
      return args;
    })();
  }

  public entityToLocalize(
    context: DefaultContext<BaseLanguageChangeArgs>
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    assertDefined(context.dbGuild);
    return context.dbGuild;
  }
}
