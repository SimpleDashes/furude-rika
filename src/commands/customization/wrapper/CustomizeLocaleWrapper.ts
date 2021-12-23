import DefaultDependency from '../../../client/providers/DefaultDependency';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import StringOption from '../../../framework/options/classes/StringOption';
import MessageFactory from '../../../helpers/MessageFactory';
import FurudeLocales from '../../../localization/FurudeLocales';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../../localization/SupportedFurudeLocales';
import CustomizeDefaultLocale from '../groups/guild/subcommands/CustomizeDefaultLocale';
import CustomizesLocaleSubCommand from './CustomizesLocaleSubCommand';

export default class CustomizeLocaleWrapper {
  public static getAllFurudeLocales(): [name: string, value: string][] {
    return Object.keys(SupportedFurudeLocales).map((l) => [l, l]);
  }

  public static getLocaleOption(choices = this.getAllFurudeLocales()) {
    return new StringOption()
      .setRequired(true)
      .setName('locale')
      .addChoices(choices);
  }

  public static async customizeLocaleResponse(
    runner: IFurudeRunner<DefaultDependency>,
    manipulate: (
      preferredLocale: SupportedFurudeLocales | null
    ) => Promise<void>,
    response: FurudeTranslationKeys,
    caller: CustomizesLocaleSubCommand
  ) {
    await runner.interaction.deferReply();

    const preferredLocale =
      SupportedFurudeLocales[
        caller.locale.apply(runner.interaction)! as SupportedFurudeLocales
      ] ?? null;

    await manipulate(preferredLocale);

    if (preferredLocale != null) {
      const localizer = new FurudeLocales({ language: preferredLocale });
      await runner.interaction.editReply({
        content: MessageFactory.success(localizer.get(response)),
      });
    } else if (caller instanceof CustomizeDefaultLocale) {
      await runner.interaction.editReply({
        content: MessageFactory.success(
          runner.args!.localizer.get(
            FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_GUILD_ANY
          )
        ),
      });
    }
  }
}
