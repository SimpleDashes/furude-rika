import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import DefaultContext from '../../../client/contexts/DefaultContext';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import StringOption from '../../../modules/framework/options/classes/StringOption';
import SupportedFurudeLocales from '../../../localization/SupportedFurudeLocales';
import IHasPreferredLocale from '../../../database/interfaces/IHasPreferredLocale';
import SnowFlakeIDEntity from '../../../database/entity/abstracts/SnowFlakeIDEntity';
import FurudeOperations from '../../../database/FurudeOperations';

export default abstract class CustomizesLocaleSubCommand extends FurudeSubCommand {
  protected abstract readonly locale: StringOption;

  protected static readonly LOCALE_NAME = 'language';

  protected getAllFurudeLocales(): [name: string, value: string][] {
    return Object.keys(SupportedFurudeLocales).map((l) => [l, l]);
  }

  protected getLocaleOption() {
    return new StringOption()
      .setRequired(true)
      .setName(CustomizesLocaleSubCommand.LOCALE_NAME)
      .addChoices(this.getAllFurudeLocales());
  }

  public constructor(description: string) {
    super({
      name: CustomizesLocaleSubCommand.LOCALE_NAME,
      description,
    });
  }

  public override createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await runner.interaction.deferReply();

      const preferredLocale =
        SupportedFurudeLocales[
          this.locale.apply(runner.interaction)! as SupportedFurudeLocales
        ] ?? null;

      const entityToLocalize = this.entityToLocalize(runner);

      const operation = entityToLocalize.setPreferredLocale(
        runner.args!.localizer,
        preferredLocale
      );

      await entityToLocalize.save();
      await FurudeOperations.answerInteraction(interaction, operation);
    };
  }

  public abstract entityToLocalize(
    runner: IFurudeRunner<DefaultContext>
  ): IHasPreferredLocale & SnowFlakeIDEntity;
}
