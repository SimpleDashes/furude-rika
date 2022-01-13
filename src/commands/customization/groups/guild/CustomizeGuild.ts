import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class CustomizeGuild extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'guild',
      description:
        'Customizes things related to your guild. (TL;DR GIMME DATA!!!!)',
    });
  }

  public async trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
