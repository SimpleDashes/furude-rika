/**
 * Hello.
 * https://github.com/Rian8337/Alice/blob/master/src/utils/helpers/StringHelper.ts
 */
export default class StringHelper {
  /**
   * Gets the proper length of a unicode string.
   *
   * @param str The unicode string to get the proper length from.
   */
  static getUnicodeStringLength(str: string): number {
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
