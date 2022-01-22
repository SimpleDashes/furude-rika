import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import MessageCreator from '../../../utils/MessageCreator';
import CurrencyContext from '../../../contexts/currency/CurrencyContext';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import type { ConstructorType } from 'discowork';
import { CommandPrecondition } from 'discowork';
import type { CommandContextOnlyInteractionAndClient } from 'discowork/lib/commands/interfaces/CommandContext';

class MustHaveOpenAccountPrecondition extends CommandPrecondition {
  public constructor() {
    super();
    this.onFailMessage = (context): string => {
      // TODO FIX TYPING
      const { localizer } = (context as CurrencyContext<unknown>).client;
      return MessageCreator.fail(
        localizer.getTranslationFromContext(
          context as CurrencyContext<unknown>,
          (k) => k.economy.error.no_account,
          {
            CURRENCY_NAME: CurrencyContainer.CURRENCY_NAME,
          }
        )
      );
    };
  }

  protected async validateInternally(
    context: CurrencyContext<unknown>
  ): Promise<boolean> {
    const { citizen } = context;
    if (citizen.justCreated) {
      return false;
    }
    return true;
  }
}

export const MustHaveOpenAccount = new MustHaveOpenAccountPrecondition();

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
