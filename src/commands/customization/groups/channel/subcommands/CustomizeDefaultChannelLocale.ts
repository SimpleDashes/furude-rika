import DefaultContext from '../../../../../client/contexts/DefaultContext';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import { RequirePermissions } from '../../../../../framework/commands/decorators/PreconditionDecorators';
import FurudeTranslationKeys from '../../../../../localization/FurudeTranslationKeys';
import SupportedFurudeLocales from '../../../../../localization/SupportedFurudeLocales';
import CustomizesServerRelatedLocaleSubCommand from '../../../wrapper/CustomizesServerRelatedLocaleSubCommand';

@RequirePermissions(['ADMINISTRATOR'])
export default class CustomizeDefaultChannelLocale extends CustomizesServerRelatedLocaleSubCommand {
  protected override locale = this.registerOption(
    this.getLocaleOption().setDescription("The channel's new locale.")
  );

  public constructor() {
    super(
      'Customizes the current channel to have an specific required locale.',
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_CHANNEL,
      FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_CHANNEL_ANY
    );
  }

  public override async manipulate(
    runner: IFurudeRunner<DefaultContext>,
    language: SupportedFurudeLocales | null
  ): Promise<void> {
    await runner.client.db.manipulate(runner.args?.dbChannel!, (o) => {
      o.preferred_locale = language;
    });
  }
}
