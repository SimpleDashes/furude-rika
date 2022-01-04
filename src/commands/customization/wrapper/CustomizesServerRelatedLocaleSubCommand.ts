import CustomizesLocaleSubCommand from './CustomizesLocaleSubCommand';

export default abstract class CustomizesServerRelatedLocaleSubCommand extends CustomizesLocaleSubCommand {
  protected static readonly ANY_LOCALE = 'any';

  protected override getAllFurudeLocales(): [name: string, value: string][] {
    return [
      [
        CustomizesServerRelatedLocaleSubCommand.ANY_LOCALE,
        CustomizesServerRelatedLocaleSubCommand.ANY_LOCALE,
      ],
      ...super.getAllFurudeLocales(),
    ];
  }

  public constructor(description: string) {
    super(description);
  }
}
