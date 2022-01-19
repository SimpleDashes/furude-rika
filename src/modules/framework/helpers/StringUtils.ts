import { Collection } from 'discord.js';
import { assertDefined } from 'discowork/src/assertions';
import type IKeyValueSet from '../interfaces/IKeyValueSet';

export default class StringUtils {
  public static toCollectionSplittedByEqualSign<T>(
    value: string,
    converter: (string: string) => T
  ): Collection<string, T> {
    const separated = value.replace(' ', '').split(',');
    const keyValueSets = separated
      .map((rawArg) => {
        const splitByEqual = rawArg.split('=');
        const returnValue: IKeyValueSet<string | undefined, T | undefined> = {
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
    for (const set of keyValueSets) {
      assertDefined(set.key);
      assertDefined(set.value);
      collection.set(set.key, set.value);
    }
    return collection;
  }

  public static toCollectionSplittedByEqualSignAsString(
    value: string
  ): Collection<string, string> {
    return this.toCollectionSplittedByEqualSign(value, (s) => s);
  }
}
