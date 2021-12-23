import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../../client/FurudeRika';
import DefaultDependency from '../../../client/providers/DefaultDependency';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import CustomizeLocaleWrapper from '../wrapper/CustomizeLocaleWrapper';
import CustomizesLocaleSubCommand from '../wrapper/CustomizesLocaleSubCommand';

export default class CustomizeLocale extends CustomizesLocaleSubCommand {
  public override locale = this.registerOption(
    CustomizeLocaleWrapper.getLocaleOption().setDescription(
      'Your preferred locale.'
    )
  );

  public constructor() {
    super({
      name: 'locale',
      description: 'Personalizes your own preferred locale!',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultDependency>,
    client: FurudeRika,
    _interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await CustomizeLocaleWrapper.customizeLocaleResponse(
        runner,
        async (l) =>
          await client.db.manipulate(runner.args!.dbUser, (o) => {
            o.preferred_locale = l;
          }),
        FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_USER,
        this
      );
    };
  }
}
