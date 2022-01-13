import { Snowflake } from 'discord.js';
import IKeyValueSet from '../../modules/framework/interfaces/IKeyValueSet';

type TSnowflakeSet<T> = IKeyValueSet<Snowflake, T>;

export default TSnowflakeSet;
