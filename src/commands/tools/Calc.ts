import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import FurudeCommand from '../../discord/FurudeCommand';
import StringOption from '../../framework/options/classes/StringOption';
import { Parser } from 'expr-eval';
import MessageFactory from '../../helpers/MessageFactory';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';

export default class Calc extends FurudeCommand {
  private expression = this.registerOption(
    new StringOption()
      .setName('expression')
      .setDescription('The expression for my lazy mind to evaluate')
      .setRequired(true)
  );

  public constructor() {
    super({
      name: 'calc',
      description: 'Calculates mathematical expressions, how nice!',
      usage: '',
    });
  }

  public async run(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.deferReply();
    const gotExpression = this.expression.apply(interaction);
    if (!gotExpression) return;
    const parsedExpression = Parser.parse(gotExpression);
    const evaluatedResult = parsedExpression.evaluate();
    await interaction.editReply({
      content: MessageFactory.success(
        client.localizer.get(FurudeTranslationKeys.CALC_RESULTS, {
          values: {
            args: [`\`${gotExpression}\``, evaluatedResult],
          },
        })
      ),
    });
  }
}
