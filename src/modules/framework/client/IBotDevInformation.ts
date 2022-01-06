import { Guild } from 'discord.js';

export default interface IBotDevInformation {
  token?: string;
  ownerIds: string[];
  developmentGuild?: Guild;
}
