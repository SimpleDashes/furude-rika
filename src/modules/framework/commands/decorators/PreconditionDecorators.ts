import { PermissionResolvable } from 'discord.js';
import Constructor from '../../interfaces/Constructor';
import ICommand from '../interfaces/ICommand';
import CommandPrecondition from '../preconditions/abstracts/CommandPrecondition';
import GuildPermissionsPreconditions from '../preconditions/GuildPermissionsPreconditions';
import IHasPreconditions from '../preconditions/interfaces/IHasPreconditions';
import OwnerPrecondition from '../preconditions/OwnerPrecondition';
import RequiresGuildPrecondition from '../preconditions/RequiresGuildPrecondition';
import RequiresSubCommandsPrecondition from '../preconditions/RequiresSubCommandsPrecondition';
import RequiresSubCommandsGroupsPrecondition from '../preconditions/RequiresSubCommandsGroupsPrecondition';

export class PreconditionConstructors {
  public static WithPermission: Constructor<
    [PermissionResolvable],
    GuildPermissionsPreconditions
  >;
}
export class SetupPrecondition {
  public static setup(owner: OwnerPrecondition) {
    this.setupOwnerPrecondition(owner);
    this.setupGuildPrecondition();
    this.setupSubCommandPrecondition();
    this.setupSubCommandGroupsPrecondition();
    this.setupGuildPermissionsPrecondition();
  }

  public static setupOwnerPrecondition(owner: OwnerPrecondition) {
    Preconditions.OwnerOnly = owner;
  }

  public static setupGuildPrecondition(
    guild = new RequiresGuildPrecondition()
  ) {
    Preconditions.GuildOnly = guild;
  }

  public static setupSubCommandPrecondition(
    subcommands = new RequiresSubCommandsPrecondition()
  ) {
    Preconditions.RequiresSubCommand = subcommands;
  }

  public static setupSubCommandGroupsPrecondition(
    subCommandGroups = new RequiresSubCommandsGroupsPrecondition()
  ) {
    Preconditions.RequiresSubCommandGroup = subCommandGroups;
  }

  public static setupGuildPermissionsPrecondition(
    permissions: Constructor<
      [PermissionResolvable],
      GuildPermissionsPreconditions
    > = GuildPermissionsPreconditions
  ) {
    PreconditionConstructors.WithPermission = permissions;
  }
}

export class Preconditions {
  public static OwnerOnly: OwnerPrecondition;
  public static GuildOnly: RequiresGuildPrecondition;
  public static RequiresSubCommand: RequiresSubCommandsPrecondition;
  public static RequiresSubCommandGroup: RequiresSubCommandsGroupsPrecondition;
  public static WithPermission = (
    permissions: PermissionResolvable
  ): GuildPermissionsPreconditions => {
    return new PreconditionConstructors.WithPermission(permissions);
  };
}

function SetPreconditions(...preconditions: CommandPrecondition[]) {
  return (target: Constructor<[...any], ICommand<any, any>>) => {
    const prototype = target.prototype as Partial<IHasPreconditions>;
    prototype.preconditions ??= [];

    const maybeGuildPrecondition = preconditions.find(
      (c) => c instanceof RequiresGuildPrecondition
    );

    const guildPrecondition = maybeGuildPrecondition ?? Preconditions.GuildOnly;

    if (
      preconditions.find((c) => c instanceof GuildPermissionsPreconditions) &&
      !preconditions.includes(guildPrecondition)
    ) {
      preconditions.push(guildPrecondition);
    }

    if (preconditions.find((c) => c instanceof RequiresGuildPrecondition)) {
      preconditions = [
        guildPrecondition,
        ...preconditions.filter(
          (c) => !(c instanceof RequiresGuildPrecondition)
        ),
      ];
    }

    prototype.preconditions = [...prototype.preconditions, ...preconditions];
  };
}

export { SetPreconditions };
