import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import DefaultDependency from '../../../client/providers/DefaultDependency';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import StringOption from '../../../framework/options/classes/StringOption';
import MessageFactory from '../../../helpers/MessageFactory';
import FurudeLocales from '../../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../../localization/SupportedFurudeLocales';

export default abstract class CustomizesLocaleSubCommand extends FurudeSubCommand {
  public abstract readonly locale: StringOption;

  public readonly manipulate: (
    runner: IFurudeRunner<DefaultDependency>,
    preferredLocale: SupportedFurudeLocales | null
  ) => Promise<void>;

  public readonly response: FurudeTranslationKeys;
  public readonly anyResponse?: FurudeTranslationKeys;

  protected static readonly LOCALE_NAME = 'locale';
  protected static readonly ANY_LOCALE = 'any';

  protected getAllFurudeLocales(): [name: string, value: string][] {
    return Object.keys(SupportedFurudeLocales).map((l) => [l, l]);
  }

  protected getAllFurudeLocalesWithAny(): [name: string, value: string][] {
    return [
      [
        CustomizesLocaleSubCommand.ANY_LOCALE,
        CustomizesLocaleSubCommand.ANY_LOCALE,
      ],
      ...this.getAllFurudeLocales(),
    ];
  }

  protected getLocaleOption(any?: boolean) {
    return new StringOption()
      .setRequired(true)
      .setName(CustomizesLocaleSubCommand.LOCALE_NAME)
      .addChoices(
        any ? this.getAllFurudeLocalesWithAny() : this.getAllFurudeLocales()
      );
  }

  public constructor(
    description: string,
    response: FurudeTranslationKeys,
    manipulate: (
      runner: IFurudeRunner<DefaultDependency>,
      preferredLocale: SupportedFurudeLocales | null
    ) => Promise<void>,
    anyResponse?: FurudeTranslationKeys
  ) {
    super({
      name: CustomizesLocaleSubCommand.ANY_LOCALE,
      description,
    });
    this.manipulate = manipulate;
    this.anyResponse = anyResponse;
    this.response = response;
  }

  public override createRunnerRunnable(
    runner: IFurudeRunner<DefaultDependency>,
    _client: FurudeRika,
    _interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await runner.interaction.deferReply();

      const preferredLocale =
        SupportedFurudeLocales[
          this.locale.apply(runner.interaction)! as SupportedFurudeLocales
        ] ?? null;

      await this.manipulate(runner, preferredLocale);

      if (preferredLocale) {
        const localizer = new FurudeLocales({ language: preferredLocale });
        await runner.interaction.editReply({
          content: MessageFactory.success(localizer.get(this.response)),
        });
      } else {
        if (this.anyResponse) {
          await runner.interaction.editReply({
            content: MessageFactory.success(
              runner.args!.localizer.get(this.anyResponse)
            ),
          });
        }
      }
    };
  }
}
