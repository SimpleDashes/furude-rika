import { CommandInformation } from 'discowork/src/commands/decorators';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';

@CommandPreconditions(Preconditions.RequiresSubCommand)
@CommandInformation({
  name: 'channel',
  description: 'Customizes things related to the current channel you are in.',
})
export default class CustomizeChannel extends FurudeCommandGroup {
  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
