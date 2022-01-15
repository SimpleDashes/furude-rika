import { Collection } from 'discord.js';

import { Parser } from 'expr-eval';
import type DefaultContext from '../../client/contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import CollectionHelper from '../../modules/framework/helpers/CollectionHelper';
import StringUtils from '../../modules/framework/helpers/StringUtils';
import StringOption from '../../modules/framework/options/classes/StringOption';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';
import { assertDefined } from '../../modules/framework/types/TypeAssertions';
import type { TypedArgs } from '../../modules/framework/commands/contexts/types';

type Args = {
  expression: StringOption;
  rawVariables: StringOption;
};
export default class Calc extends FurudeCommand<
  DefaultContext<TypedArgs<Args>>,
  Args
> {
  public createArgs(): Args {
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

  public constructor() {
    super({
      name: 'calc',
      description: 'Calculates mathematical expressions, how nice!',
    });
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
    const { interaction, localizer, args } = context;

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
          localizer.get(FurudeTranslationKeys.CALC_MISSING_VARIABLES, [
            MessageCreator.block(missingVariables.toString()),
            expressionText,
          ])
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
          localizer.get(FurudeTranslationKeys.CALC_EVALUATE_ERROR, [
            expressionText,
          ])
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
      displayText = localizer.get(FurudeTranslationKeys.CALC_RESULTS, [
        expressionText,
        MessageCreator.block(evaluatedResult.toString()),
      ]);
      if (gotVariables && rawVariables) {
        displayText += `, ${localizer.get(
          FurudeTranslationKeys.CALC_ADDITIONAL_VARIABLES,
          [MessageCreator.block(rawVariables.trim())]
        )}`;
      }
      displayText = MessageCreator.success(displayText);
    } else {
      displayText = MessageCreator.fail(
        localizer.get(FurudeTranslationKeys.CALC_EVALUATE_ERROR, [
          expressionText,
        ])
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
