import { CommandInformation } from 'discowork/src/commands/decorators';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import type DefaultContext from '../../../contexts/DefaultContext';
import FurudeCommand from '../../../discord/commands/FurudeCommand';

@CommandPreconditions(Preconditions.RequiresSubCommand)
@CommandInformation({
  name: 'reminder',
  description:
    'Setups a little reminder for you to get your lazy uwu working on next time.',
})
export default class RemindMe extends FurudeCommand<
  unknown,
  DefaultContext<unknown>
> {
  public createArguments(): unknown {
    return {};
  }

  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
