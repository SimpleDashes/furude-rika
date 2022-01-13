import FurudeCommand from '../../discord/commands/FurudeCommand';
import {
  Preconditions,
  SetPreconditions,
} from '../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class Economy extends FurudeCommand {
  public constructor() {
    super({
      name: 'economy',
      description: 'Economy, related commands all of then here...',
    });
  }

  public async trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
