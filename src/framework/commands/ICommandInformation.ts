import { PermissionResolvable } from 'discord.js';

export default interface ICommandInformation {
  readonly name: string;
  readonly description: string;
  readonly usage: string;
  readonly permissions?: PermissionResolvable;
  readonly ownerOnly?: boolean;
}
