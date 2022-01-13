import { Snowflake } from 'discord.js';
import { Column } from 'typeorm';
import KeySetHelper from '../../../modules/framework/helpers/KeySetHelper';
import TSnowflakeSet from '../../interfaces/TSnowflakeSet';
import { HyperTypes } from './HyperTypes';

/**
 * Represents a value which can have 2 different
 * versions of itself (Local, Global), useful for
 * things such as XP which we nay have a guild exclusive
 * XP and a global XP, or even currency.
 */
export default abstract class GlobalLocalValue<T, K> {
  @Column('array')
  public locals: TSnowflakeSet<T>[] = [];

  @Column('number')
  public global: T | null;

  private forceDefaultValue: T | null;

  public constructor(forceDefaultValue?: T | null) {
    if (forceDefaultValue !== null || forceDefaultValue === undefined) {
      forceDefaultValue = this.defaultValue();
    }
    this.forceDefaultValue = forceDefaultValue;
    this.global = this.forceDefaultValue;
  }

  public currentLocal(key: K): T | null {
    const realKey = this.getLocalDecorationKey(key);
    const current = KeySetHelper.getValue(this.locals, realKey);
    if (current) return current;
    const newValue = this.forceDefaultValue;
    this.setLocal(key, newValue);
    return newValue;
  }

  public setLocal(key: K, value: T | null): void {
    KeySetHelper.setValue(this.locals, this.getLocalDecorationKey(key), value);
  }

  public values(key: K): (T | null)[] {
    return [this.global, this.currentLocal(key)];
  }

  private assertKeyNotUndefined(key: K | undefined | null): key is K {
    if (key === undefined) {
      throw 'Key should be present when getting or setting a local value!';
    }
    return true;
  }

  public getValueSwitchedForType(
    key: K | undefined | null,
    type: HyperTypes
  ): T | null {
    switch (type) {
      case HyperTypes.global:
        return this.global;
      case HyperTypes.local:
        if (this.assertKeyNotUndefined(key)) {
          return this.currentLocal(key);
        }
        break;
      default:
        return this.global;
    }
    return null;
  }

  public setValueSwitchedForType(
    key: K | undefined | null,
    type: HyperTypes,
    value: T
  ): void {
    switch (type) {
      case HyperTypes.global:
        this.global = value;
        break;
      case HyperTypes.local:
        if (this.assertKeyNotUndefined(key)) {
          this.setLocal(key, value);
        }
        break;
    }
  }

  public abstract defaultValue(): T;

  public abstract getLocalDecorationKey(key: K): Snowflake;
}
