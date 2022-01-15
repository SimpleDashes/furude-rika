import CurrencyContainer from '../../../containers/CurrencyContainer';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import CommandPrecondition from '../../../modules/framework/commands/preconditions/abstracts/CommandPrecondition';
import CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import type { OmittedCommandContext } from '../../../modules/framework/commands/contexts/ICommandContext';
import type { TypedArgs } from '../../../modules/framework/commands/decorators/ContextDecorators';

class MustHaveOpenAccountPrecondition extends CommandPrecondition<
  CurrencyContext<TypedArgs<unknown>>
> {
  public constructor() {
    super();
    this.onFailMessage = (context): string => {
      const { localizer } = context;
      return MessageCreator.error(
        localizer.get(FurudeTranslationKeys.ECONOMY_MUST_HAVE_ACCOUNT)
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
  public getResultMessage(
    context: CurrencyContext<TypedArgs<A>>,
    key: FurudeTranslationKeys
  ): string {
    const { localizer } = context;
    return localizer.get(key, [CurrencyContainer.CURRENCY_NAME]);
  }

  public override createContext(
    baseContext: OmittedCommandContext
  ): CurrencyContext<TypedArgs<A>> {
    return new CurrencyContext(baseContext);
  }
}
