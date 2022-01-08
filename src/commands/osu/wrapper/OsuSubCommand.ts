import { CommandInteraction, CacheType, User } from 'discord.js';
import OsuContext from '../../../client/contexts/osu/OsuContext';
import FurudeRika from '../../../client/FurudeRika';
import CommandOptions from '../../../containers/CommandOptions';
import Strings from '../../../containers/Strings';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../../modules/framework/interactions/InteractionUtils';
import StringOption from '../../../modules/framework/options/classes/StringOption';
import UserOption from '../../../modules/framework/options/classes/UserOption';
import OsuUserRecentsLimitBindable from '../../../modules/osu/bindables/OsuUserRecentsLimitBindable';
import IOsuScore from '../../../modules/osu/scores/IOsuScore';
import BanchoServer from '../../../modules/osu/servers/implementations/bancho/BanchoServer';
import IBanchoOsuUserParams from '../../../modules/osu/servers/implementations/bancho/params/IBanchoOsuUserParams';
import IBanchoOsuUserRecentParams from '../../../modules/osu/servers/implementations/bancho/params/IBanchoOsuUserRecentParams';
import DroidServer from '../../../modules/osu/servers/implementations/droid/DroidServer';
import IDroidOsuUserParam from '../../../modules/osu/servers/implementations/droid/params/IDroidOsuUserParam';
import IDroidOsuUserRecentsParam from '../../../modules/osu/servers/implementations/droid/params/IDroidOsuUserRecentsParams';
import OsuServer from '../../../modules/osu/servers/OsuServer';
import OsuServers from '../../../modules/osu/servers/OsuServers';
import IOsuUser from '../../../modules/osu/users/IOsuUser';

type OsuServerOption = Omit<StringOption, 'setAutocomplete'>;
type OsuServerSwitcher<
  S extends OsuServer<any, any, any, any, any, any, any>,
  T
> = { (server: S): T };

interface IServerSwitchListeners<T> {
  onBancho: OsuServerSwitcher<BanchoServer, T>;
  onDroid: OsuServerSwitcher<DroidServer, T>;
}

export interface OsuServerUserOptions {
  user: StringOption;
  server: OsuServerOption;
}

export default abstract class OsuSubCommand extends FurudeSubCommand {
  public abstract override createRunnerRunnable(
    runner: IFurudeRunner<OsuContext>,
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void>;

  public override ContextType(): (runner: IFurudeRunner<any>) => OsuContext {
    return (runner) => new OsuContext(runner);
  }

  protected getServerOptions(): OsuServerOption {
    return new StringOption()
      .setName(CommandOptions.server)
      .addChoices(OsuServers.servers.map((s) => [s.name, s.name]));
  }

  protected getOsuUserOption() {
    return new StringOption().setName(CommandOptions.username);
  }

  protected registerDiscordUserOption(command: OsuSubCommand) {
    return command.registerOption(
      new UserOption(true).setName(CommandOptions.user)
    );
  }

  protected registerServerUserOptions(
    command: OsuSubCommand,
    setup: (o: OsuServerUserOptions) => void
  ): OsuServerUserOptions {
    const options = {
      user: command.registerOption(this.getOsuUserOption()),
      server: command.registerOption(this.getServerOptions()),
    };
    setup(options);
    return options;
  }

  protected applyToServerOption(
    option: OsuServerOption,
    interaction: CommandInteraction
  ): OsuServer<any, any, any, any, any, any, any> {
    const name = option.apply(interaction);
    return name
      ? (
          OsuServers as unknown as Record<
            string,
            OsuServer<any, any, any, any, any, any, any>
          >
        )[name] ?? OsuServers.bancho
      : OsuServers.bancho;
  }

  protected async getUserFromServerUserOptions(
    options: OsuServerUserOptions,
    runner: IFurudeRunner<OsuContext>,
    user?: User | null
  ): Promise<IOsuUser | undefined> {
    const server = this.applyToServerOption(options.server, runner.interaction);

    user ??= runner.interaction.user;
    let username = options.user.apply(runner.interaction);

    return await this.getUserFromServer(server, runner, username, user);
  }

  protected async sendOsuUserNotFound(runner: IFurudeRunner<OsuContext>) {
    await InteractionUtils.reply(
      runner.interaction,
      MessageCreator.error(
        runner.args!.localizer.get(FurudeTranslationKeys.OSU_ACCOUNT_NOT_FOUND)
      )
    );
  }

  protected async getUserFromServer(
    server: OsuServer<any, any, any, any, any, any, any>,
    runner: IFurudeRunner<OsuContext>,
    username?: string | null,
    user: User = runner.interaction.user
  ): Promise<IOsuUser | undefined> {
    if (!username) {
      const dbOsuPlayer = await runner.args!.OSU_PLAYER.default(user);
      const dbUsername = dbOsuPlayer.getAccount(server);
      if (dbUsername) {
        username = dbUsername.toString();
      }
    }

    if (!username) {
      username = Strings.EMPTY;
    }

    return await server.users.get(
      this.getParamsForOsuUserRequest(server, username)
    );
  }

  protected async getUserRecentFromServer(
    server: OsuServer<any, any, any, any, IOsuScore, any, any>,
    user: IOsuUser,
    limit?: number
  ): Promise<IOsuScore[]> {
    return (
      (await server.userRecents.get(
        this.getParamsForOsuUserRecentRequest(server, user, limit)
      )) ?? []
    );
  }

  protected switchServer<
    S extends OsuServer<any, any, any, any, any, any, any>
  >(server: S, listeners: IServerSwitchListeners<void>): void {
    switch (server.name) {
      case OsuServers.bancho.name:
        listeners.onBancho(server as any as BanchoServer);
        break;
      case OsuServers.droid.name:
        listeners.onDroid(server as any as DroidServer);
        break;
    }
  }

  protected switchForParams<
    S extends OsuServer<any, any, any, any, any, any, any>,
    T
  >(params: T, server: S, listeners: IServerSwitchListeners<T>): T {
    this.switchServer(server, {
      onBancho: (s) => {
        params = listeners.onBancho(s);
      },
      onDroid: (s) => {
        params = listeners.onDroid(s);
      },
    });
    return params;
  }

  protected getParamsForOsuUserRequest(
    server: OsuServer<any, any, any, any, any, any, any>,
    usernameID: string
  ): Partial<IBanchoOsuUserParams | IDroidOsuUserParam> {
    let params: Partial<IBanchoOsuUserParams | IDroidOsuUserParam> = {};
    params = this.switchForParams(params, server, {
      onBancho: (): Partial<IBanchoOsuUserParams> => {
        return {
          u: usernameID,
        };
      },
      onDroid: (): Partial<IDroidOsuUserParam> => {
        return {
          uid: parseInt(usernameID),
        };
      },
    });
    return params;
  }

  protected getParamsForOsuUserRecentRequest(
    server: OsuServer<any, any, any, any, any, any, any>,
    user: IOsuUser,
    limit?: number
  ) {
    let params: Partial<
      IBanchoOsuUserRecentParams | IDroidOsuUserRecentsParam
    > = {};
    params = this.switchForParams(params, server, {
      onBancho: (): Partial<IBanchoOsuUserRecentParams> => {
        return {
          u: user.user_id,
        };
      },
      onDroid: (): Partial<IDroidOsuUserRecentsParam> => {
        return {
          u: user,
        };
      },
    });
    params = {
      ...params,
      ...{
        limit: limit ? new OsuUserRecentsLimitBindable(limit) : undefined,
      },
    };
    return params;
  }
}
