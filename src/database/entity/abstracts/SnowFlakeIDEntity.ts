import { Snowflake } from 'discord-api-types';
import type { SaveOptions } from 'typeorm';
import { ObjectIdColumn } from 'typeorm';
import type BindableValue from '../../../modules/osu/bindables/BindableValue';
import type IOnSaveListener from '../../interfaces/IOnSaveListener';
import WithJustCreatedIdentifierEntity from './WithJustCreatedIdentifierEntity';

export default class SnowFlakeIDEntity extends WithJustCreatedIdentifierEntity {
  #onSaveListeners: IOnSaveListener[] | null = [];

  @ObjectIdColumn({ type: 'string' })
  public declare id: Snowflake;

  public constructor() {
    super();
  }

  public registerSaveListener<T extends IOnSaveListener>(listener: T): T {
    if (this.#onSaveListeners) {
      this.#onSaveListeners.push(listener);
    }
    return listener;
  }

  public assignBindableCurrentValue<T>(bindable: BindableValue<T>): T {
    return bindable.Value;
  }

  public override async save(options?: SaveOptions): Promise<this> {
    if (this.#onSaveListeners) {
      this.#onSaveListeners.forEach((listener) => listener.beforeSaving());
    }
    return await super.save(options);
  }
}
