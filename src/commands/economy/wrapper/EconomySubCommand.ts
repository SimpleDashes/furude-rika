import { CommandInteraction, CacheType } from 'discord.js';
import CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import FurudeRika from '../../../client/FurudeRika';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import Constructor from '../../../modules/framework/interfaces/Constructor';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';

export interface EconomyRunner extends IFurudeRunner<CurrencyContext> {
  getResultMessage: (key: FurudeTranslationKeys) => string;
}

type mayMustHaveAccount = {
  mustHaveAccount: boolean;
};

export function MustHaveOpenAccount(target: Constructor<EconomySubCommand>) {
  (target.prototype as mayMustHaveAccount).mustHaveAccount = true;
}

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

  public override createRunnerRunnable(
    runner: EconomyRunner,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    const thisWhichMayRequiresAccount = this as unknown as mayMustHaveAccount;
    if (
      thisWhichMayRequiresAccount.mustHaveAccount &&
      runner.args!.dbUser.citizen.justCreated
    ) {
      return async () => {
        await interaction.reply({
          content: MessageCreator.error(
            runner.args!.localizer.get(
              FurudeTranslationKeys.ECONOMY_MUST_HAVE_ACCOUNT
            )
          ),
        });
      };
    }
    return async () => {
      await this.createRunnerRunnableInternally(runner, client, interaction)();
    };
  }

  public abstract createRunnerRunnableInternally(
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
