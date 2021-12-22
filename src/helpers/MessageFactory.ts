import ClientEmojis from '../containers/ClientEmojis';

export default abstract class MessageFactory {
  private constructor() {}

  public static prefixedString(prefix: string, value: string): string {
    return `${prefix} | ${value}`;
  }

  public static error(value: string): string {
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

  public static objectToKeyValueString(
    obj: any,
    options: {
      fixedNumber: number;
    } = {
      fixedNumber: 0,
    }
  ) {
    let s = '';
    for (const k in obj) {
      const v = (obj as Record<string, unknown>)[k];
      s += `${k}: ${
        typeof v === 'number' ? `${v.toFixed(options.fixedNumber)}` : v
      }\n`;
    }
    return s;
  }
}
