import { PermissionResolvable } from 'discord.js';
import ArrayHelper from '../../helpers/ArrayHelper';
import Constructor from '../../interfaces/Constructor';
import ICommand from '../interfaces/ICommand';
import CommandPrecondition from '../preconditions/abstracts/CommandPrecondition';
import GuildPermissionsPreconditions from '../preconditions/GuildPermissionsPreconditions';
import IHasPreconditions from '../preconditions/interfaces/IHasPreconditions';
import OwnerPrecondition from '../preconditions/OwnerPrecondition';
import RequiresGuildPrecondition from '../preconditions/RequiresGuildPrecondition';

let ownerPrecondition: OwnerPrecondition;
const guildPrecondition = new RequiresGuildPrecondition();

function initOwnerPrecondition(ownerCondition: OwnerPrecondition) {
  ownerPrecondition = ownerCondition;
}

function pushIfPreconditionsExistsElseCreate(
  target: Constructor<ICommand<any, any>>,
  precondition: CommandPrecondition
) {
  const prototype = target.prototype as Partial<IHasPreconditions>;
  prototype.preconditions = ArrayHelper.pushToArrayIfItExistsElseCreateArray(
    prototype.preconditions,
    precondition
  );
}

function OwnerOnly(target: Constructor<ICommand<any, any>>) {
  pushIfPreconditionsExistsElseCreate(target, ownerPrecondition);
}

function RequirePermissions(requiredPermissions: PermissionResolvable) {
  return (target: Constructor<ICommand<any, any>>) => {
    RequiresGuild(target);
    pushIfPreconditionsExistsElseCreate(
      target,
      new GuildPermissionsPreconditions(requiredPermissions)
    );
  };
}

function RequiresSubCommands(target: Constructor<ICommand<any, any>>) {
  (target.prototype as unknown as IHasPreconditions).requiresSubCommands = true;
}

function RequiresSubGroups(target: Constructor<ICommand<any, any>>) {
  (target.prototype as unknown as IHasPreconditions).requiresSubGroups = true;
}

function RequiresGuild(target: Constructor<ICommand<any, any>>) {
  pushIfPreconditionsExistsElseCreate(target, guildPrecondition);
}

export {
  initOwnerPrecondition,
  OwnerOnly,
  RequirePermissions,
  RequiresSubCommands,
  RequiresSubGroups,
};
