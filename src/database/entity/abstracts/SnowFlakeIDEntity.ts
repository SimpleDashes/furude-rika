import { Snowflake } from 'discord.js';
import type { SaveOptions } from 'typeorm';
import { Column, Entity } from 'typeorm';
import type BindableValue from '../../../modules/bindables/BindableValue';
import type IHasJustCreatedIdentifier from '../../interfaces/IHasJustCreatedIdentifier';
import type IOnSaveListener from '../../interfaces/IOnSaveListener';
import GeneratedIDEntity from './GeneratedIDEntity';

@Entity()
export default class SnowFlakeIDEntity
  extends GeneratedIDEntity
  implements IHasJustCreatedIdentifier
{
  private onSaveListeners: IOnSaveListener[] | null = [];

  /**
   * Secondary ID
   */
  @Column()
  public s_id!: Snowflake;

  @Column({ update: false, nullable: true, type: 'bool' })
  public justCreated: boolean | null = null;

  public registerSaveListener<T extends IOnSaveListener>(listener: T): T {
    if (this.onSaveListeners) {
      this.onSaveListeners.push(listener);
    }
    return listener;
  }

  public assignBindableCurrentValue<T>(bindable: BindableValue<T>): T {
    return bindable.Current;
  }

  public override async save(options?: SaveOptions): Promise<this> {
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
