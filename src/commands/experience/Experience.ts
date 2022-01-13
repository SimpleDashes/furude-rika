import FurudeCommand from '../../discord/commands/FurudeCommand';
import {
  Preconditions,
  SetPreconditions,
} from '../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class Experience extends FurudeCommand {
  public constructor() {
    super({
      name: 'experience',
      description: '.',
    });
  }

  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
