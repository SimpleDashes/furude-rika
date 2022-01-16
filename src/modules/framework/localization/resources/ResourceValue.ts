import { Chance } from 'chance';
import Localizer from '../Localizer';

class ResourceValue<A extends string = never> {
  static #CHANCE = Chance();

  public args: A[] = [];

  #builder: (placeholder: Record<A, string>) => string[] | string;
  #record = {} as Record<A, string>;

  /**
   * Get's the resource value, with placeholder.
   * the get assessor allows for resource values to be possible
   * to implement random results.
   */
  public get Value(): string {
    const response = this.#builder(this.#record);
    return typeof response === 'string'
      ? response
      : ResourceValue.#CHANCE.pickone(response);
  }

  public constructor(
    builder: (placeholder: Record<A, string>) => string[] | string,
    args: A[],
    variableSettings = Localizer.defaultVariableSettings
  ) {
    this.#builder = builder;

    for (const arg of args) {
      this.#record[arg] = Localizer.getVariableNameForSetting(
        arg,
        variableSettings
      );
    }

    this.args = args;
  }
}

export default ResourceValue;
