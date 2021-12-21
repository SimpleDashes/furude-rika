import { Collection } from 'discord.js';

export default class StringUtils {
  public static toCollectionSplittedByEqualSign<T>(
    value: string,
    converter: (string: string) => T
  ) {
    const separated = value.replace(' ', '').split(',');
    const keyValueSets = separated
      .map((rawArg) => {
        const splitByEqual = rawArg.split('=');
        return {
          key: splitByEqual[0],
          value:
            splitByEqual[1] == undefined
              ? undefined
              : converter(splitByEqual[1]),
        };
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
