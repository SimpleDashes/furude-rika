import type IDiscordOption from './interfaces/IDiscordOption';

export default class DiscordOptionHelper {
  public static isObjectOption(
    object: unknown
  ): object is IDiscordOption<unknown> {
    const tObject = object as IDiscordOption<unknown>;
    return (
      typeof tObject.name === 'string' &&
      typeof tObject.required === 'boolean' &&
      typeof tObject.description === 'string' &&
      typeof tObject.apiType !== undefined
    );
  }
}
