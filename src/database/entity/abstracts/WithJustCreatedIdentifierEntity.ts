import { BaseEntity } from 'typeorm';
import type IHasJustCreatedIdentifier from '../../interfaces/IHasJustCreatedIdentifier';

export default class WithJustCreatedIdentifierEntity
  extends BaseEntity
  implements IHasJustCreatedIdentifier
{
  public id!: unknown;

  public justCreated: boolean;

  public constructor() {
    super();
    this.justCreated = !this.id;
  }
}
