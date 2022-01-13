import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class CustomizeExperience extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'experience',
      description:
        'Customizes things related to experience. (TL;DR GIMME DATA!!!!)',
    });
  }

  public async trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
