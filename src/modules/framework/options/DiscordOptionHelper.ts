import type IDiscordOption from './interfaces/IDiscordOption';
import type { ILazyApply } from './interfaces/ILazyApply';

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

  public static isLazyApplyOption(object: unknown): object is ILazyApply {
    const tObject = object as ILazyApply;
    return (
      this.isObjectOption(tObject) && typeof tObject.lazyApply === 'boolean'
    );
  }
}
