import type { ConstructorType } from 'discowork';
import type { CommandContextOnlyInteractionAndClient } from 'discowork/lib/commands/interfaces/CommandContext';
import ReminderContext from '../../../contexts/reminders/ReminderContext';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';

export default abstract class ReminderCommand<A> extends FurudeSubCommand<
  A,
  ReminderContext<A>
> {
  public override contextConstructor(): ConstructorType<
    [CommandContextOnlyInteractionAndClient],
    ReminderContext<A>
  > {
    return ReminderContext;
  }
}
