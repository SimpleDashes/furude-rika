import type { WorkerCommand, ConstructorType } from 'discowork';
import type { CommandContextOnlyInteractionAndClient } from 'discowork/lib/commands/interfaces/CommandContext';
import type DefaultContext from '../../../contexts/DefaultContext';

interface IFurudeCommand<A, CTX extends DefaultContext<A>>
  extends WorkerCommand<A, CTX> {
  trigger: (context: CTX) => Promise<void>;
  contextConstructor: () =>
    | ConstructorType<[CommandContextOnlyInteractionAndClient], CTX>
    | undefined;
}

export default IFurudeCommand;
