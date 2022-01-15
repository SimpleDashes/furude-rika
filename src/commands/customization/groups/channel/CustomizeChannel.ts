import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../modules/framework/preconditions/PreconditionDecorators';
@SetPreconditions(Preconditions.RequiresSubCommand)
export default class CustomizeChannel extends FurudeCommandGroup {
  public constructor() {
    super({
      name: 'channel',
      description:
        'Customizes things related to the current channel you are in.',
    });
  }

  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
