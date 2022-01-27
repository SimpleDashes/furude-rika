import FurudeSubCommand from '../../../../discord/commands/FurudeSubCommand';
import CurrencyContext from '../../../../contexts/currency/CurrencyContext';
import type { ConstructorType } from 'discowork';
import type { CommandContextOnlyInteractionAndClient } from 'discowork/lib/commands/interfaces/CommandContext';

export default abstract class EconomySubCommand<A> extends FurudeSubCommand<
  A,
  CurrencyContext<A>
> {
  public override contextConstructor(): ConstructorType<
    [CommandContextOnlyInteractionAndClient],
    CurrencyContext<A>
  > {
    return CurrencyContext;
  }
}
