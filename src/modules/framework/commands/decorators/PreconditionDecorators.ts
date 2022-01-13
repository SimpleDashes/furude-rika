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
import ICommandContext from '../interfaces/ICommandContext';

export class SetupPrecondition {
  public static setup(owner: OwnerPrecondition): void {
    this.setupOwnerPrecondition(owner);
    this.setupGuildPrecondition();
    this.setupSubCommandPrecondition();
    this.setupSubCommandGroupsPrecondition();
    this.setupGuildPermissionsPrecondition();
  }

  public static setupOwnerPrecondition(condition: OwnerPrecondition): void {
    Preconditions.OwnerOnly = condition;
  }

  public static setupGuildPrecondition(
    condition = new RequiresGuildPrecondition()
  ): void {
    Preconditions.GuildOnly = condition;
  }

  public static setupSubCommandPrecondition(
    condition = new RequiresSubCommandsPrecondition()
  ): void {
    Preconditions.RequiresSubCommand = condition;
  }

  public static setupSubCommandGroupsPrecondition(
    condition = new RequiresSubCommandsGroupsPrecondition()
  ): void {
    Preconditions.RequiresSubCommandGroup = condition;
  }

  public static setupGuildPermissionsPrecondition(
    creator = (
      permissions: PermissionResolvable
    ): GuildPermissionsPreconditions =>
      new GuildPermissionsPreconditions(permissions)
  ): void {
    Preconditions.WithPermission = creator;
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
    return new GuildPermissionsPreconditions(permissions);
  };
}

function SetPreconditions(...preconditions: CommandPrecondition<never>[]) {
  return (
    target: Constructor<[...unknown[]], ICommand<ICommandContext>>
  ): void => {
    const prototype = target.prototype as Partial<IHasPreconditions<never>>;
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
