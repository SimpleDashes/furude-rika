import { CommandInteraction, PermissionResolvable } from 'discord.js';
import BaseBot from '../../client/BaseBot';
import PermissionPrecondition from '../preconditions/abstracts/PermissionPrecondition';

interface IRunsCommand<T extends BaseBot> {
  readonly client: T;
  readonly interaction: CommandInteraction;
  run?: () => Promise<void>;
  onInsufficientPermissions?: (
    failedCondition: PermissionPrecondition,
    missingPermissions?: PermissionResolvable
  ) => Promise<void>;
  onMissingRequiredSubCommands?: () => Promise<void>;
  onMissingRequiredGuild?: () => Promise<void>;
}

export default IRunsCommand;
