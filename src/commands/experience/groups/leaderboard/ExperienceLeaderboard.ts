import DefaultContext from '../../../../client/contexts/DefaultContext';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../modules/framework/commands/decorators/PreconditionDecorators';

@SetPreconditions(Preconditions.RequiresSubCommand)
export default class ExperienceLeaderboard extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'leaderboard',
      description: '.',
    });
  }

  public trigger(_context: DefaultContext): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
