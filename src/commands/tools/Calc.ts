import { Collection } from 'discord.js';
import { assertDefined } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import StringOption from 'discowork/lib/options/classes/StringOption';
import InteractionUtils from 'discowork/lib/utils/InteractionUtils';
import { Parser } from 'expr-eval';
import type DefaultContext from '../../contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import CollectionHelper from '../../modules/framework/helpers/CollectionHelper';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import StringUtils from '../../modules/framework/helpers/StringUtils';

type Args = {
  expression: StringOption;
  rawVariables: StringOption;
};

@CommandInformation({
  name: 'calc',
  description: 'Calculates mathematical expressions, how nice!',
})
export default class Calc extends FurudeCommand<Args, DefaultContext<Args>> {
  public createArguments(): Args {
    return {
      expression: new StringOption()
        .setRequired(true)
        .setName('expression')
        .setDescription('The expression you want my lazy mind to evaluate'),
      rawVariables: new StringOption()
        .setName('variables')
        .setDescription(
          'The variables to be used for the expression. e.g: "x=1, y=2"'
        ),
    };
  }

  public async trigger(context: DefaultContext<Args>): Promise<void> {
    const { interaction, client, args } = context;
    const { localizer } = client;

    let { expression } = args;
    const { rawVariables } = args;

    assertDefined(expression);

    expression = expression.replace(' ', '');

    const gotVariables = rawVariables
      ? this.#getAllInputVariablesCollection(rawVariables, expression)
      : undefined;

    const allVariables = this.#getAllRequiredVariablesArray(expression);

    const missingVariables = gotVariables
      ? this.#getAllMissingRequiredVariablesArray(allVariables, gotVariables)
      : [];

    const expressionText = MessageCreator.block(expression.trim());

    if (missingVariables.length != 0) {
      await InteractionUtils.reply(
        interaction,
        MessageCreator.fail(
          localizer.getTranslationFromContext(
            context,
            (k) => k.calc.variables.missing,
            {
              VARIABLES: MessageCreator.block(missingVariables.toString()),
              EXPRESSION: expressionText,
            }
          )
        )
      );
      return;
    }

    let parsedExpression;
    try {
      parsedExpression = Parser.parse(expression);
    } catch {
      await InteractionUtils.reply(
        interaction,
        MessageCreator.fail(
          localizer.getTranslationFromContext(context, (k) => k.calc.fail, {
            EXPRESSION: expressionText,
          })
        )
      );
      return;
    }

    let evaluatedResult: number | null = null;
    try {
      evaluatedResult = parsedExpression.evaluate(
        gotVariables ? CollectionHelper.collectionToRecord(gotVariables) : {}
      );
    } catch {
      // invalid input.
    }

    let displayText;
    if (evaluatedResult) {
      displayText = localizer.getTranslationFromContext(
        context,
        (k) => k.calc.response,
        {
          EXPRESSION: expressionText,
          RESULT: MessageCreator.block(evaluatedResult.toString()),
        }
      );
      if (gotVariables && rawVariables) {
        displayText += `, ${localizer.getTranslationFromContext(
          context,
          (k) => k.calc.variables.description,
          {
            VARIABLES: MessageCreator.block(rawVariables.trim()),
          }
        )}`;
      }
      displayText = MessageCreator.success(displayText);
    } else {
      displayText = MessageCreator.fail(
        localizer.getTranslationFromContext(context, (k) => k.calc.fail, {
          EXPRESSION: expressionText,
        })
      );
    }

    await InteractionUtils.reply(interaction, displayText);
  }

  #getAllMissingRequiredVariablesArray(
    allVariables: string[],
    gotVariables: Collection<string, number>
  ): string[] {
    const missingVariables = [];

    for (const variable of allVariables) {
      if (!gotVariables?.has(variable)) {
        missingVariables.push(variable);
      }
    }

    return missingVariables;
  }

  #getAllRequiredVariablesArray(gotExpression: string): string[] {
    let currentVariableName = '';
    const allVariables: string[] = [];

    const tempAllCharacters = Array.from(gotExpression).filter((char) => {
      return char.toLowerCase() != char.toUpperCase();
    });

    for (let i = 0; i < tempAllCharacters.length; i++) {
      const current = tempAllCharacters[i];
      const next = tempAllCharacters[i + 1];

      if (current) {
        const newCurrentVariableName = currentVariableName + current;
        const nextNewCurrentVariableName = newCurrentVariableName + next;
        if (
          gotExpression.includes(newCurrentVariableName) &&
          gotExpression.includes(nextNewCurrentVariableName)
        ) {
          currentVariableName = newCurrentVariableName;
        } else {
          if (!gotExpression.includes(nextNewCurrentVariableName)) {
            currentVariableName = newCurrentVariableName;
          }
          allVariables.push(currentVariableName.slice());
          currentVariableName = '';
        }
      }
    }

    return allVariables;
  }

  #getAllInputVariablesCollection(
    gotVariablesRaw: string,
    gotExpression: string
  ): Collection<string, number> {
    const gotVariables: Collection<string, number> = new Collection();
    if (gotVariablesRaw) {
      const split =
        StringUtils.toCollectionSplittedByEqualSignAsString(gotVariablesRaw);

      for (const set of split) {
        let value;
        try {
          value = Parser.parse(set[1]).evaluate();
        } catch {
          // invalid input.
        }
        if (value) {
          if (gotExpression?.includes(set[0])) {
            gotVariables?.set(set[0], value);
          }
        }
      }
    }

    return gotVariables;
  }
}
