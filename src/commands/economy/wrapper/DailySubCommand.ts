import type CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import FurudeOperations from '../../../database/FurudeOperations';
import type IDatabaseOperation from '../../../database/interfaces/IDatabaseOperation';
import type { HyperTypes } from '../../../database/objects/hypervalues/HyperTypes';
import type { TypedArgs } from '../../../modules/framework/commands/contexts/types';
import type ICommandInformation from '../../../modules/framework/commands/interfaces/ICommandInformation';
import type IHasPreconditions from '../../../modules/framework/preconditions/interfaces/IHasPreconditions';
import EconomySubCommand, { MustHaveOpenAccount } from './EconomySubCommand';

export type DailyArgs = unknown;
export default abstract class DailySubCommand extends EconomySubCommand<DailyArgs> {
  public createArgs(): DailyArgs {
    return {};
  }

  public constructor(information: ICommandInformation) {
    super(information);
    if (
      !(
        this as unknown as IHasPreconditions<
          CurrencyContext<TypedArgs<DailyArgs>>
        >
      ).preconditions.includes(MustHaveOpenAccount)
    ) {
      throw 'DailySubCommand implementations should include MustHaveOpenAccount precondition.';
    }
  }

  public async trigger(
    context: CurrencyContext<TypedArgs<DailyArgs>>
  ): Promise<void> {
    const { citizen, interaction } = context;

    const scope = this.dailyScope();

    const baseOperation = citizen.claimDaily(context, scope);

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
