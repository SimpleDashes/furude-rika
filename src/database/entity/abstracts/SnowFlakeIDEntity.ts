import { Snowflake } from 'discord.js';
import {
  BaseEntity,
  Column,
  Entity,
  ObjectIdColumn,
  SaveOptions,
} from 'typeorm';
import BindableValue from '../../../framework/bindables/BindableValue';

@Entity()
export default class SnowFlakeIDEntity
  extends BaseEntity
  implements IHasJustCreatedIdentifier
{
  private onSaveListeners: IOnSaveListener[] | null = [];

  /**
   * Secondary ID
   */
  @ObjectIdColumn()
  s_id!: Snowflake;

  @Column({ update: false, nullable: true, type: 'bool' })
  justCreated: boolean | null = null;

  public registerSaveListener<T extends IOnSaveListener>(listener: T): T {
    if (this.onSaveListeners) {
      this.onSaveListeners.push(listener);
    }
    return listener;
  }

  public assignBindableCurrentValue<T>(bindable: BindableValue<T>): T {
    return bindable.Current;
  }

  override async save(options?: SaveOptions): Promise<this> {
    this.justCreated = null;
    if (this.onSaveListeners) {
      for (const listener of this.onSaveListeners) {
        listener.beforeSaving();
      }
    }
    this.onSaveListeners = null;
    return await super.save(options);
  }
}
