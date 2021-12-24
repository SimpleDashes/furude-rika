import { CommandInteraction, CacheType, Collection } from 'discord.js';

import { Parser } from 'expr-eval';
import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';
import IRunsCommand from '../../framework/commands/interfaces/IRunsCommand';
import CollectionHelper from '../../framework/helpers/CollectionHelper';
import StringUtils from '../../framework/helpers/StringUtils';
import Constructor from '../../framework/interfaces/Constructor';
import StringOption from '../../framework/options/classes/StringOption';
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
    });
  }

  public override createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const gotExpression = this.expression
        .apply(interaction)!
        .replace(' ', '');
      const gotVariablesRaw = this.variables.apply(interaction);

      const gotVariables = this.getAllInputVariablesCollection(
        gotVariablesRaw!,
        gotExpression
      );

      const allVariables = this.getAllRequiredVariablesArray(gotExpression);

      const missingVariables = this.getAllMissingRequiredVariablesArray(
        allVariables,
        gotVariables
      );

      const expressionText = MessageFactory.block(gotExpression!.trim());

      if (missingVariables.length != 0) {
        await interaction.editReply(
          MessageFactory.error(
            runner.args!.localizer.get(
              FurudeTranslationKeys.CALC_MISSING_VARIABLES,
              [
                MessageFactory.block(missingVariables.toString()),
                expressionText,
              ]
            )
          )
        );
        return;
      }

      const parsedExpression = Parser.parse(gotExpression!);

      let evaluatedResult: number | null = null;
      try {
        evaluatedResult = parsedExpression.evaluate(
          CollectionHelper.collectionToRecord(gotVariables)
        );
      } catch {}

      let displayText;
      if (evaluatedResult) {
        displayText = runner.args!.localizer.get(
          FurudeTranslationKeys.CALC_RESULTS,
          [expressionText, MessageFactory.block(evaluatedResult.toString())]
        );
        if (gotVariables && gotVariablesRaw) {
          displayText += `, ${runner.args!.localizer.get(
            FurudeTranslationKeys.CALC_ADDITIONAL_VARIABLES,
            [MessageFactory.block(gotVariablesRaw.trim())]
          )}`;
        }
        displayText = MessageFactory.success(displayText);
      } else {
        displayText = MessageFactory.error(
          runner.args!.localizer.get(
            FurudeTranslationKeys.CALC_EVALUATE_ERROR,
            [expressionText]
          )
        );
      }

      await interaction.editReply({
        content: displayText,
      });
    };
  }

  private getAllMissingRequiredVariablesArray(
    allVariables: string[],
    gotVariables: Collection<string, number>
  ) {
    const missingVariables = [];

    for (const variable of allVariables) {
      if (!gotVariables?.has(variable)) {
        missingVariables.push(variable);
      }
    }

    return missingVariables;
  }

  private getAllRequiredVariablesArray(gotExpression: string) {
    let currentVariableName = '';
    const allVariables: string[] = [];

    const tempAllCharacters = Array.from(gotExpression!).filter((char) => {
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

  private getAllInputVariablesCollection(
    gotVariablesRaw: string,
    gotExpression: string
  ) {
    let gotVariables: Collection<string, number> | null = new Collection();
    if (gotVariablesRaw) {
      const split =
        StringUtils.toCollectionSplittedByEqualSignAsString(gotVariablesRaw);

      for (const set of split) {
        let value;
        try {
          value = Parser.parse(set[1]).evaluate();
        } catch {}
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
