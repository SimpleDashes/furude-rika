import { Snowflake } from 'discord.js';
import IKeyValueSet from '../../framework/interfaces/IKeyValueSet';

export default interface ISnowflakeSet<T> extends IKeyValueSet<Snowflake, T> {}
