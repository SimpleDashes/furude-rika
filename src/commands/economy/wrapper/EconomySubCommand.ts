import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import CommandPrecondition from '../../../modules/framework/preconditions/abstracts/CommandPrecondition';
import CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import type { OmittedCommandContext } from '../../../modules/framework/commands/contexts/ICommandContext';
import type { TypedArgs } from '../../../modules/framework/commands/contexts/types';
import CurrencyContainer from '../../../containers/CurrencyContainer';

class MustHaveOpenAccountPrecondition extends CommandPrecondition<
  CurrencyContext<TypedArgs<unknown>>
> {
  public constructor() {
    super();
    this.onFailMessage = (context): string => {
      const { localizer } = context.client;
      return MessageCreator.fail(
        localizer.getTranslationFromContext(
          context,
          (k) => k.economy.error.no_account,
          {
            CURRENCY_NAME: CurrencyContainer.CURRENCY_NAME,
          }
        )
      );
    };
  }

  protected async validateInternally(
    context: CurrencyContext<TypedArgs<unknown>>
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
  CurrencyContext<TypedArgs<A>>,
  A
> {
  public override createContext(
    baseContext: OmittedCommandContext
  ): CurrencyContext<TypedArgs<A>> {
    return new CurrencyContext(baseContext);
  }
}
