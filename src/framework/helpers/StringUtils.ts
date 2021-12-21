import { Collection } from 'discord.js';
import IKeyValue from '../interfaces/IKeyValue';

export default class StringUtils {
  public static toCollectionSplittedByEqualSign<T>(
    value: string,
    converter: (string: string) => T
  ) {
    const separated = value.replace(' ', '').split(',');
    const keyValueSets = separated
      .map((rawArg) => {
        const splitByEqual = rawArg.split('=');
        const returnValue: IKeyValue<string | undefined, T | undefined> = {
          key: splitByEqual[0],
          value:
            splitByEqual[1] == undefined
              ? undefined
              : converter(splitByEqual[1]),
        };
        return returnValue;
      })
      .filter((set) => set.key != undefined && set.value != undefined);
    const collection: Collection<string, T> = new Collection();
    keyValueSets.forEach((set) => {
      collection.set(set.key!, set.value!);
    });
    return collection;
  }

  public static toCollectionSplittedByEqualSignAsString(value: string) {
    return this.toCollectionSplittedByEqualSign(value, (s) => s);
  }
}
