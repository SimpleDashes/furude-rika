import { assertDefined } from 'discowork/src/assertions';
import { CommandInformation } from 'discowork/src/commands/decorators';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import type DefaultContext from '../../../../../contexts/DefaultContext';
import type SnowFlakeIDEntity from '../../../../../database/entity/abstracts/SnowFlakeIDEntity';
import type IHasPreferredLocale from '../../../../../database/interfaces/IHasPreferredLocale';

import type { BaseLanguageChangeArgs } from '../../../wrapper/CustomizesLocaleSubCommand';
import CustomizesLocaleSubCommand from '../../../wrapper/CustomizesLocaleSubCommand';
import CustomizesServerRelatedLocaleSubCommand from '../../../wrapper/CustomizesServerRelatedLocaleSubCommand';

@CommandPreconditions(Preconditions.WithPermission('MANAGE_CHANNELS'))
@CommandInformation({
  name: CustomizesLocaleSubCommand.LOCALE_NAME,
  description: 'Customizes the channel to have a forced specific locale.',
})
export default class CustomizeDefaultChannelLocale extends CustomizesServerRelatedLocaleSubCommand {
  public override createArguments(): BaseLanguageChangeArgs {
    return ((): BaseLanguageChangeArgs => {
      const args = super.createArguments();
      args.locale.setDescription("The channel's new locale.");
      return args;
    })();
  }

  public entityToLocalize(
    context: DefaultContext<BaseLanguageChangeArgs>
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    assertDefined(context.dbChannel);
    return context.dbChannel;
  }
}
