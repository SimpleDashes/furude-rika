import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import DefaultContext from '../../../client/contexts/DefaultContext';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import StringOption from '../../../framework/options/classes/StringOption';
import MessageFactory from '../../../helpers/MessageFactory';
import FurudeLocales from '../../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../../localization/SupportedFurudeLocales';
import IHasPreferredLocale from '../../../database/interfaces/IHasPreferredLocale';
import SnowFlakeIDEntity from '../../../database/entity/abstracts/SnowFlakeIDEntity';

export default abstract class CustomizesLocaleSubCommand extends FurudeSubCommand {
  protected abstract readonly locale: StringOption;

  private readonly response: FurudeTranslationKeys;

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

  public constructor(description: string, response: FurudeTranslationKeys) {
    super({
      name: CustomizesLocaleSubCommand.LOCALE_NAME,
      description,
    });
    this.response = response;
  }

  public override createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    _interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await runner.interaction.deferReply();

      const preferredLocale =
        SupportedFurudeLocales[
          this.locale.apply(runner.interaction)! as SupportedFurudeLocales
        ] ?? null;

      const entityToLocalize = this.entityToLocalize(runner);

      entityToLocalize.preferred_locale = preferredLocale;

      await entityToLocalize.save();

      if (preferredLocale) {
        const localizer = new FurudeLocales({ language: preferredLocale });
        await runner.interaction.editReply({
          content: MessageFactory.success(localizer.get(this.response)),
        });
      } else {
        await this.onLocaleNotFound(runner);
      }
    };
  }

  public abstract entityToLocalize(
    runner: IFurudeRunner<DefaultContext>
  ): IHasPreferredLocale & SnowFlakeIDEntity;

  public async onLocaleNotFound(
    _runner: IFurudeRunner<DefaultContext>
  ): Promise<void> {}
}
