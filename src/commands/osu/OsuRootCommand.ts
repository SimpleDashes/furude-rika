import type OsuContext from '../../client/contexts/osu/OsuContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import type { TypedArgs } from '../../modules/framework/commands/decorators/ContextDecorators';

export default class OsuRootCommand extends FurudeCommand<
  OsuContext<TypedArgs<unknown>>,
  unknown
> {
  public createArgs(): unknown {
    return {};
  }

  public constructor() {
    super({
      name: 'osu',
      description: '.',
    });
  }

  public trigger(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
