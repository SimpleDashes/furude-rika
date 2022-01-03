import { CacheType, CommandInteraction, Snowflake } from 'discord.js';
import { Column } from 'typeorm';
import KeySetHelper from '../../../framework/helpers/KeySetHelper';
import ISnowflakeSet from '../../interfaces/ISnowflakeSet';
import { HyperTypes } from './HyperTypes';

/**
 * Represents a value which can have 2 different
 * versions of itself (Local, Global), useful for
 * things such as XP which we nay have a guild exclusive
 * XP and a global XP, or even currency.
 */
export default abstract class GlobalLocalValue<T> {
  @Column('array')
  public locals: ISnowflakeSet<T>[] = [];

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

  public currentLocal(interaction: CommandInteraction): T | null {
    const key = this.getLocalDecorationKey(interaction);
    const current = KeySetHelper.getValue(this.locals, key);
    if (current) return current;
    const newValue = this.forceDefaultValue;
    this.setLocal(interaction, newValue);
    return newValue;
  }

  public setLocal(interaction: CommandInteraction, value: T | null) {
    KeySetHelper.setValue(
      this.locals,
      this.getLocalDecorationKey(interaction),
      value
    );
  }

  public values(interaction: CommandInteraction) {
    return [this.global, this.currentLocal(interaction)];
  }

  public getValueSwitchedForType(
    interaction: CommandInteraction,
    type: HyperTypes
  ): T | null {
    switch (type) {
      case HyperTypes.global:
        return this.global;
      case HyperTypes.local:
        return this.currentLocal(interaction);
      default:
        return this.global;
    }
  }

  public setValueSwitchedForType(
    interaction: CommandInteraction,
    type: HyperTypes,
    value: T
  ) {
    switch (type) {
      case HyperTypes.global:
        this.global = value;
        break;
      case HyperTypes.local:
        this.setLocal(interaction, value);
        break;
      default:
        this.global = value;
        break;
    }
  }

  public abstract defaultValue(): T;

  public abstract getLocalDecorationKey(
    interaction: CommandInteraction<CacheType>
  ): Snowflake;
}
