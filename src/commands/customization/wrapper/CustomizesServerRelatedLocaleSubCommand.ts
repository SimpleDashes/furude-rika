import DefaultContext from '../../../client/contexts/DefaultContext';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import MessageFactory from '../../../helpers/MessageFactory';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import CustomizesLocaleSubCommand from './CustomizesLocaleSubCommand';

export default abstract class CustomizesServerRelatedLocaleSubCommand extends CustomizesLocaleSubCommand {
  protected static readonly ANY_LOCALE = 'any';

  private readonly anyResponse: FurudeTranslationKeys;

  protected override getAllFurudeLocales(): [name: string, value: string][] {
    return [
      [
        CustomizesServerRelatedLocaleSubCommand.ANY_LOCALE,
        CustomizesServerRelatedLocaleSubCommand.ANY_LOCALE,
      ],
      ...super.getAllFurudeLocales(),
    ];
  }

  public constructor(
    description: string,
    response: FurudeTranslationKeys,
    anyResponse: FurudeTranslationKeys
  ) {
    super(description, response);
    this.anyResponse = anyResponse;
  }

  public override async onLocaleNotFound(
    runner: IFurudeRunner<DefaultContext>
  ): Promise<void> {
    await runner.interaction.editReply({
      content: MessageFactory.success(
        runner.args!.localizer.get(this.anyResponse)
      ),
    });
  }
}
