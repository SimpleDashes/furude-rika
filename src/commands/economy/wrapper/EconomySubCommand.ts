import { CommandInteraction, CacheType } from 'discord.js';
import CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import FurudeRika from '../../../client/FurudeRika';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../../modules/framework/interactions/InteractionUtils';
import CommandPrecondition from '../../../modules/framework/commands/preconditions/abstracts/CommandPrecondition';

export interface EconomyRunner extends IFurudeRunner<CurrencyContext> {
  getResultMessage: (key: FurudeTranslationKeys) => string;
}

class MustHaveOpenAccountPrecondition extends CommandPrecondition {
  protected async validateInternally(runner: EconomyRunner): Promise<boolean> {
    if (runner.args!.citizen.justCreated) {
      await InteractionUtils.reply(
        runner.interaction,
        MessageCreator.error(
          runner.args!.localizer.get(
            FurudeTranslationKeys.ECONOMY_MUST_HAVE_ACCOUNT
          )
        )
      );
      return false;
    }
    return true;
  }
}

export const MustHaveOpenAccount = new MustHaveOpenAccountPrecondition();

export default abstract class EconomySubCommand extends FurudeSubCommand {
  public override async createRunner(
    interaction: CommandInteraction<CacheType>
  ): Promise<EconomyRunner> {
    const runner: Partial<EconomyRunner> = await super.createRunner(
      interaction
    );
    runner.getResultMessage = (key: FurudeTranslationKeys) => {
      return runner.args!.localizer.get(key, [CurrencyContainer.CURRENCY_NAME]);
    };
    return runner as EconomyRunner;
  }

  public abstract override createRunnerRunnable(
    runner: EconomyRunner,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void>;

  public override ContextType(): (
    runner: IFurudeRunner<any>
  ) => CurrencyContext {
    return (runner) => new CurrencyContext(runner);
  }
}
