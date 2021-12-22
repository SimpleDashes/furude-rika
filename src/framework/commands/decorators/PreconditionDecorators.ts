import { PermissionResolvable } from 'discord.js';
import ArrayHelper from '../../helpers/ArrayHelper';
import Constructor from '../../interfaces/Constructor';
import BaseCommand from '../BaseCommand';
import CommandPrecondition from '../preconditions/abstracts/CommandPrecondition';
import GuildPermissionsPreconditions from '../preconditions/GuildPermissionsPreconditions';
import IHasPreconditions from '../preconditions/interfaces/IHasPreconditions';
import OwnerPrecondition from '../preconditions/OwnerPrecondition';

let ownerPrecondition: OwnerPrecondition;

function initOwnerPrecondition(ownerCondition: OwnerPrecondition) {
  ownerPrecondition = ownerCondition;
}

function pushIfPreconditionsExistsElseCreate<T extends BaseCommand<any>>(
  target: Constructor<T>,
  precondition: CommandPrecondition
) {
  const prototype = target.prototype as Partial<IHasPreconditions>;
  prototype.preconditions = ArrayHelper.pushToArrayIfItExistsElseCreateArray(
    prototype.preconditions,
    precondition
  );
}

function OwnerOnly<T extends BaseCommand<any>>(target: Constructor<T>) {
  pushIfPreconditionsExistsElseCreate(target, ownerPrecondition);
}

function RequirePermissions<T extends BaseCommand<any>>(
  requiredPermissions: PermissionResolvable
) {
  return (target: Constructor<T>) => {
    pushIfPreconditionsExistsElseCreate(
      target,
      new GuildPermissionsPreconditions(requiredPermissions)
    );
  };
}

function RequiresSubCommands<T extends BaseCommand<any>>(
  target: Constructor<T>
) {
  (target.prototype as unknown as IHasPreconditions).requiresSubCommands = true;
}

export {
  initOwnerPrecondition as initPreconditions,
  OwnerOnly,
  RequirePermissions,
  RequiresSubCommands,
};
