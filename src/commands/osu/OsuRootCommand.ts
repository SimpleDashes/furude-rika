import { CommandInformation } from 'discowork/src/commands/decorators';
import type OsuContext from '../../contexts/osu/OsuContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';

@CommandInformation({
  name: 'osu',
  description: '.',
})
export default class OsuRootCommand extends FurudeCommand<
  unknown,
  OsuContext<unknown>
> {
  public createArguments(): unknown {
    return {};
  }

  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
