import type { CommandContextOnlyInteractionAndClient } from 'discowork/src/commands/interfaces/CommandContext';
import type WorkerCommand from 'discowork/src/commands/interfaces/WorkerCommand';
import type { ConstructorType } from 'discowork/src/types';
import type DefaultContext from '../../../contexts/DefaultContext';

interface IFurudeCommand<A, CTX extends DefaultContext<A>>
  extends WorkerCommand<A, CTX> {
  trigger: (context: CTX) => Promise<void>;
  contextConstructor: () =>
    | ConstructorType<[CommandContextOnlyInteractionAndClient], CTX>
    | undefined;
}

export default IFurudeCommand;
