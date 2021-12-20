import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import FurudeCommand from '../../discord/FurudeCommand';
import StringOption from '../../framework/options/classes/StringOption';
import { Parser } from 'expr-eval';
import MessageFactory from '../../helpers/MessageFactory';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';

export default class Calc extends FurudeCommand {
  private readonly expression = this.registerOption(
    new StringOption()
      .setName('expression')
      .setDescription('The expression for my lazy mind to evaluate')
      .setRequired(true)
  );

  private readonly variables = this.registerOption(
    new StringOption()
      .setName('variables')
      .setDescription(
        'The variables to be used for the expression. e.g: "x=1, y=2"'
      )
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
    const gotVariablesRaw = this.variables.apply(interaction);

    let gotVariables: Record<string, number> | null = null;
    if (gotVariablesRaw) {
      const args = gotVariablesRaw.replace(' ', '').split(',');
      args.forEach((rawArg) => {
        const arg = rawArg.split('=');
        if (arg[0] && arg[1]) {
          const key = arg[0];
          let value;
          try {
            value = Parser.parse(arg[1]).evaluate();
          } catch {}
          if (value) {
            if (gotExpression?.includes(key)) {
              if (!gotVariables) {
                gotVariables = {};
              }
              gotVariables[key] = value;
            }
          }
        }
      });
    }

    const parsedExpression = Parser.parse(gotExpression!);

    let evaluatedResult;
    try {
      evaluatedResult = parsedExpression.evaluate(gotVariables ?? undefined);
    } catch {}

    let displayText;
    if (evaluatedResult) {
      displayText = client.localizer.get(FurudeTranslationKeys.CALC_RESULTS, {
        values: {
          args: [MessageFactory.block(gotExpression!), evaluatedResult],
        },
      });
      if (gotVariables && gotVariablesRaw) {
        displayText += `, ${client.localizer.get(
          FurudeTranslationKeys.CALC_ADDITIONAL_VARIABLES,
          {
            values: {
              args: [MessageFactory.block(gotVariablesRaw.trim())],
            },
          }
        )}`;
      }
      displayText = MessageFactory.success(displayText);
    } else {
      displayText = MessageFactory.error(
        client.localizer.get(FurudeTranslationKeys.CALC_EVALUATE_ERROR, {
          values: {
            args: [MessageFactory.block(gotExpression!.trim())],
          },
        })
      );
    }

    await interaction.editReply({
      content: displayText,
    });
  }
}
