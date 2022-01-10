import { PermissionResolvable } from 'discord.js';
import Constructor from '../../interfaces/Constructor';
import ICommand from '../interfaces/ICommand';
import CommandPrecondition from '../preconditions/abstracts/CommandPrecondition';
import GuildPermissionsPreconditions from '../preconditions/GuildPermissionsPreconditions';
import IHasPreconditions from '../preconditions/interfaces/IHasPreconditions';
import OwnerPrecondition from '../preconditions/OwnerPrecondition';
import RequiresGuildPrecondition from '../preconditions/RequiresGuildPrecondition';

export class SetupPrecondition {
  public static setup(options: { owner: OwnerPrecondition }) {
    Preconditions.OwnerOnly = options.owner;
    Preconditions.GuildOnly = new RequiresGuildPrecondition();
  }
}

export class Preconditions {
  static OwnerOnly: OwnerPrecondition;
  static GuildOnly: RequiresGuildPrecondition;
  static WithPermission = (
    permissions: PermissionResolvable
  ): GuildPermissionsPreconditions => {
    return new GuildPermissionsPreconditions(permissions);
  };
}

function addPreconditions(
  target: Constructor<ICommand<any, any>>,
  ...preconditions: CommandPrecondition[]
) {
  const prototype = target.prototype as Partial<IHasPreconditions>;
  prototype.preconditions ??= [];
  if (preconditions.find((c) => c instanceof GuildPermissionsPreconditions)) {
    preconditions = [Preconditions.GuildOnly, ...preconditions];
  }
  prototype.preconditions = [...prototype.preconditions, ...preconditions];
}

function SetPreconditions(...preconditions: CommandPrecondition[]) {
  return (target: Constructor<ICommand<any, any>>) => {
    addPreconditions(target, ...preconditions);
  };
}

function RequiresSubCommands(target: Constructor<ICommand<any, any>>) {
  (target.prototype as unknown as IHasPreconditions).requiresSubCommands = true;
}

function RequiresSubGroups(target: Constructor<ICommand<any, any>>) {
  (target.prototype as unknown as IHasPreconditions).requiresSubGroups = true;
}

export { RequiresSubCommands, RequiresSubGroups, SetPreconditions };
