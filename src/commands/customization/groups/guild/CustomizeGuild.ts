import { CommandInformation } from 'discowork/src/commands/decorators';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import FurudeCommandGroup from '../../../../discord/commands/FurudeCommandGroup';

@CommandPreconditions(Preconditions.RequiresSubCommand)
@CommandInformation({
  name: 'guild',
  description:
    'Customizes things related to your guild. (TL;DR GIMME DATA!!!!)',
})
export default class CustomizeGuild extends FurudeCommandGroup {
  public async trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
