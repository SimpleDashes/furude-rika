import type IHasJustCreatedIdentifier from '../interfaces/IHasJustCreatedIdentifier';

export default class DBTypeUtils {
  public static isWIthJustCreatedIdentifier(
    entity: unknown
  ): entity is IHasJustCreatedIdentifier {
    const tEntity = entity as unknown as IHasJustCreatedIdentifier;
    return typeof tEntity.justCreated === 'boolean';
  }
}
