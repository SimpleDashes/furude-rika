import { CommandInteraction, CacheType, Interaction } from 'discord.js';
import FurudeRika from '../../../../../client/FurudeRika';
import DefaultDependency from '../../../../../client/providers/DefaultDependency';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import { RequirePermissions } from '../../../../../framework/commands/decorators/PreconditionDecorators';
import FurudeTranslationKeys from '../../../../../localization/FurudeTranslationKeys';
import CustomizeLocaleWrapper from '../../../wrapper/CustomizeLocaleWrapper';
import CustomizesLocaleSubCommand from '../../../wrapper/CustomizesLocaleSubCommand';

@RequirePermissions(['ADMINISTRATOR'])
export default class CustomizeDefaultLocale extends CustomizesLocaleSubCommand {
  public override locale = this.registerOption(
    CustomizeLocaleWrapper.getLocaleOption([
      [this.anyLocale, this.anyLocale],
      ...CustomizeLocaleWrapper.getAllFurudeLocales(),
    ]).setDescription("The guild's new locale.")
  );

  public constructor() {
    super({
      name: 'locale',
      description: 'Customizes the guild to have a forced specific locale.',
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
          await client.db.manipulate(runner.args?.dbGuild!, (o) => {
            o.preferred_locale = l;
          }),
        FurudeTranslationKeys.CUSTOMIZE_LOCALE_RESPONSE_GUILD,
        this
      );
    };
  }
}
