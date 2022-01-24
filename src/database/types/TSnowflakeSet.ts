import type { Snowflake } from 'discord.js';
import type IKeyValueSet from '../../discord/interfaces/IKeyValueSet';

type SnowflakeSet<T> = IKeyValueSet<Snowflake, T>;

export type { SnowflakeSet };
