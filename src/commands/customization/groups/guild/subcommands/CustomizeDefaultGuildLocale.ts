import DefaultContext from '../../../../../client/contexts/DefaultContext';
import SnowFlakeIDEntity from '../../../../../database/entity/abstracts/SnowFlakeIDEntity';
import IHasPreferredLocale from '../../../../../database/interfaces/IHasPreferredLocale';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import { RequirePermissions } from '../../../../../modules/framework/commands/decorators/PreconditionDecorators';
import CustomizesServerRelatedLocaleSubCommand from '../../../wrapper/CustomizesServerRelatedLocaleSubCommand';

@RequirePermissions(['MANAGE_GUILD'])
export default class CustomizeDefaultGuildLocale extends CustomizesServerRelatedLocaleSubCommand {
  protected override locale = this.registerOption(
    this.getLocaleOption().setDescription("The guild's new locale.")
  );

  public constructor() {
    super('Customizes the guild to have a forced specific locale.');
  }

  public entityToLocalize(
    runner: IFurudeRunner<DefaultContext>
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    return runner.args!.dbGuild!;
  }
}
