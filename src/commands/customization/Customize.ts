import DefaultContext from '../../client/contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import {
  Preconditions,
  SetPreconditions,
} from '../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class Customize extends FurudeCommand {
  public constructor() {
    super({
      name: 'customize',
      description: 'customizes information about you, GIMME YOUR DATA1!!11!',
    });
  }

  public trigger(_context: DefaultContext): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
