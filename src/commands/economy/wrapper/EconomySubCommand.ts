import CurrencyContainer from '../../../containers/CurrencyContainer';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import CommandPrecondition from '../../../modules/framework/commands/preconditions/abstracts/CommandPrecondition';
import CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import ICommandContext from '../../../modules/framework/commands/interfaces/ICommandContext';

class MustHaveOpenAccountPrecondition extends CommandPrecondition<CurrencyContext> {
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
    context: CurrencyContext
  ): Promise<boolean> {
    const { citizen } = context;
    if (citizen.justCreated) {
      return false;
    }
    return true;
  }
}

export const MustHaveOpenAccount = new MustHaveOpenAccountPrecondition();

export default abstract class EconomySubCommand extends FurudeSubCommand<CurrencyContext> {
  public getResultMessage(
    context: CurrencyContext,
    key: FurudeTranslationKeys
  ): string {
    const { localizer } = context;
    return localizer.get(key, [CurrencyContainer.CURRENCY_NAME]);
  }

  public override createContext(baseContext: ICommandContext): CurrencyContext {
    return new CurrencyContext(baseContext);
  }
}
