import { Collection } from 'discord.js';
import { assertDefined } from 'discowork';
import type IKeyValueSet from '../discord/interfaces/IKeyValueSet';

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
    keyValueSets.forEach((set) => {
      assertDefined(set.key);
      assertDefined(set.value);
      collection.set(set.key, set.value);
    });
    return collection;
  }

  public static toCollectionSplittedByEqualSignAsString(
    value: string
  ): Collection<string, string> {
    return this.toCollectionSplittedByEqualSign(value, (s) => s);
  }

  /**
   * Gets the proper length of a unicode string.
   *
   * @param str The unicode string to get the proper length from.
   */
  public static getUnicodeStringLength(str: string): number {
    // Standards: https://datatracker.ietf.org/doc/html/rfc3629|Reference

    let s: number = str.length;

    for (let i = str.length - 1; i >= 0; --i) {
      const code: number = str.charCodeAt(i);

      if (code > 0x7f && code <= 0x7ff) {
        ++s;
      } else if (code > 0x7ff && code <= 0xffff) {
        s += 2;
      }

      if (code >= 0xdc00 && code <= 0xdfff) {
        --i; //trail surrogate
      }
    }

    return s;
  }
}
