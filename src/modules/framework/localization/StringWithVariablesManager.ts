import IStringWithVariable from './IStringWithVariable';
import IVariableManagerGetter from './IVariableManagerGetter';

const variablePrefix = '[$';
const variableEnd = ']';

export default class StringWithVariablesManager {
  public stringsWithVariables: Record<string, IStringWithVariable> = {};

  public addString(withVariable: string, key?: string): void {
    key = key ?? withVariable;
    this.stringsWithVariables[key] = {
      string: withVariable,
      args: withVariable
        .split(' ')
        .filter((word) => {
          return word.startsWith(variablePrefix) && word.includes(variableEnd);
        })
        .map((word) => {
          return word.slice(
            variablePrefix.length,
            word.indexOf(variableEnd) - (variableEnd.length - 1)
          );
        }),
    };
  }

  public getString(args: IVariableManagerGetter): string | undefined {
    const find = this.stringsWithVariables[args.key];
    if (!find) return;
    if (!(args.args.length === find.args.length)) {
      throw `Invalid number of arguments for this string with variables`;
    }
    let returnString = find.string;
    for (let i = 0; i < find.args.length; i++) {
      const findArg = `${variablePrefix}${find.args[i]}${variableEnd}`;
      const returnArg = args.args[i];
      if (returnArg) {
        returnString = returnString.replace(findArg, returnArg);
      }
    }
    return returnString;
  }
}

export { variablePrefix };
