import { CommandPreconditions, Preconditions } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';

@CommandPreconditions(Preconditions.RequiresSubCommand)
@CommandInformation({
  name: 'recent',
  description: '.',
})
export default class OsuRecent extends FurudeCommandGroup {
  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
