import DefaultContext from '../../../../../client/contexts/DefaultContext';
import SnowFlakeIDEntity from '../../../../../database/entity/abstracts/SnowFlakeIDEntity';
import IHasPreferredLocale from '../../../../../database/interfaces/IHasPreferredLocale';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/commands/decorators/PreconditionDecorators';
import CustomizesServerRelatedLocaleSubCommand from '../../../wrapper/CustomizesServerRelatedLocaleSubCommand';

@SetPreconditions(Preconditions.WithPermission('MANAGE_CHANNELS'))
export default class CustomizeDefaultChannelLocale extends CustomizesServerRelatedLocaleSubCommand {
  protected override locale = this.registerOption(
    this.getLocaleOption().setDescription("The channel's new locale.")
  );

  public constructor() {
    super(
      'Customizes the current channel to have an specific required locale.'
    );
  }

  public entityToLocalize(
    runner: IFurudeRunner<DefaultContext>
  ): IHasPreferredLocale & SnowFlakeIDEntity {
    return runner.args!.dbChannel!;
  }
}
