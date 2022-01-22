import { getUnixTime } from 'date-fns';
import ClientEmojis from '../containers/ClientEmojis';

export default abstract class MessageCreator {
  public static prefixedString(prefix: string, value: string): string {
    return `${prefix} | ${value}`;
  }

  public static fail(value: string): string {
    return this.bold(this.prefixedString(ClientEmojis.negate, value));
  }

  public static success(value: string): string {
    return this.bold(this.prefixedString(ClientEmojis.success, value));
  }

  public static bold(value: string): string {
    return `**${value}**`;
  }

  public static block(value: string): string {
    return `\`${value}\``;
  }

  public static blockQuote(value: string): string {
    return `>>> ${value}`;
  }

  public static hyperLink(value: string, url: string): string {
    return `[${value}](${url})`;
  }

  public static underLine(value: string): string {
    return `__${value}__`;
  }

  public static timeStamp(date: Date): string {
    return `<t:${getUnixTime(date)}>`;
  }

  public static breakLine(value: string): string {
    return `${value}\n`;
  }

  public static objectToKeyValueString(
    object: unknown,
    options = {
      fixedNumber: 0,
    }
  ): string {
    let s = '';
    const recordObject = object as Record<string, unknown>;
    for (const k in recordObject) {
      const v = recordObject[k];
      s += `${k}: ${
        typeof v === 'number' ? `${v.toFixed(options.fixedNumber)}` : v
      }\n`;
    }
    return s;
  }
}
