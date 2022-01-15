import type DefaultContext from '../../../../../client/contexts/DefaultContext';
import type SnowFlakeIDEntity from '../../../../../database/entity/abstracts/SnowFlakeIDEntity';
import type IHasPreferredLocale from '../../../../../database/interfaces/IHasPreferredLocale';
import type { TypedArgs } from '../../../../../modules/framework/commands/contexts/types';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/preconditions/PreconditionDecorators';
import { assertDefined } from '../../../../../modules/framework/types/TypeAssertions';
import type { BaseLanguageChangeArgs } from '../../../wrapper/CustomizesLocaleSubCommand';
import CustomizesServerRelatedLocaleSubCommand from '../../../wrapper/CustomizesServerRelatedLocaleSubCommand';

@SetPreconditions(Preconditions.WithPermission('MANAGE_GUILD'))
export default class CustomizeDefaultGuildLocale extends CustomizesServerRelatedLocaleSubCommand {
  public override createArgs(): BaseLanguageChangeArgs {
    return ((): BaseLanguageChangeArgs => {
      const args = super.createArgs();
      args.locale.setDescription("The guild's new locale.");
      return args;
    })();
  }

  public constructor() {
    super('Customizes the guild to have a forced specific locale.');
  }

  public entityToLocalize(
    context: DefaultContext<TypedArgs<BaseLanguageChangeArgs>>
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    assertDefined(context.dbGuild);
    return context.dbGuild;
  }
}
