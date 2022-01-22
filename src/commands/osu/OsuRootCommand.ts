import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
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
