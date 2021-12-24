import DefaultContext from '../../../../../client/contexts/DefaultContext';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import { RequirePermissions } from '../../../../../framework/commands/decorators/PreconditionDecorators';
import FurudeTranslationKeys from '../../../../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../../../../localization/SupportedFurudeLocales';
import CustomizesServerRelatedLocaleSubCommand from '../../../wrapper/CustomizesServerRelatedLocaleSubCommand';

@RequirePermissions(['ADMINISTRATOR'])
export default class CustomizeDefaultGuildLocale extends CustomizesServerRelatedLocaleSubCommand {
  protected override locale = this.registerOption(
    this.getLocaleOption().setDescription("The guild's new locale.")
  );

  public constructor() {
    super(
      'Customizes the guild to have a forced specific locale.',
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_GUILD,
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_GUILD_ANY
    );
  }

  public override async manipulate(
    runner: IFurudeRunner<DefaultContext>,
    language: SupportedFurudeLocales | null
  ): Promise<void> {
    await runner.client.db.manipulate(runner.args?.dbGuild!, (o) => {
      o.preferred_locale = language;
    });
  }
}
