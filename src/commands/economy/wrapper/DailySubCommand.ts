import CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import FurudeOperations from '../../../database/FurudeOperations';
import IDatabaseOperation from '../../../database/interfaces/IDatabaseOperation';
import { HyperTypes } from '../../../database/objects/hypervalues/HyperTypes';
import ICommandInformation from '../../../modules/framework/commands/interfaces/ICommandInformation';
import IHasPreconditions from '../../../modules/framework/commands/preconditions/interfaces/IHasPreconditions';
import EconomySubCommand, { MustHaveOpenAccount } from './EconomySubCommand';

export default abstract class DailySubCommand extends EconomySubCommand {
  public constructor(information: ICommandInformation) {
    super(information);
    if (
      !(
        this as unknown as IHasPreconditions<CurrencyContext>
      ).preconditions.includes(MustHaveOpenAccount)
    ) {
      throw 'DailySubCommand implementations should include MustHaveOpenAccount precondition.';
    }
  }

  public async trigger(context: CurrencyContext): Promise<void> {
    const { citizen, interaction, localizer } = context;

    const scope = this.dailyScope();

    const baseOperation = citizen.claimDaily(interaction, localizer, scope);

    const operation: IDatabaseOperation = {
      ...baseOperation,
      ...{
        response: `${scope.toUpperCase()}: ${baseOperation.response}`,
      },
    };

    await FurudeOperations.saveWhenSuccess(citizen, operation);
    await FurudeOperations.answerInteraction(interaction, operation);
  }

  public abstract dailyScope(): HyperTypes;
}
