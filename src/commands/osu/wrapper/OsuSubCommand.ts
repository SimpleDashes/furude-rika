import {
  CommandInteraction,
  CacheType,
  User,
  MessageEmbedAuthor,
} from 'discord.js';
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
import IBanchoOsuUserParams from '../../../modules/osu/servers/implementations/bancho/params/IBanchoOsuUserParams';
import IBanchoOsuUserRecentParams from '../../../modules/osu/servers/implementations/bancho/params/IBanchoOsuUserRecentParams';
import IDroidOsuUserParam from '../../../modules/osu/servers/implementations/droid/params/IDroidOsuUserParam';
import IDroidOsuUserRecentsParam from '../../../modules/osu/servers/implementations/droid/params/IDroidOsuUserRecentsParams';
import OsuServers, { AnyServer } from '../../../modules/osu/servers/OsuServers';
import IOsuUser from '../../../modules/osu/users/IOsuUser';
import OsuServerUtils from '../../../utils/OsuServerUtils';

type OsuServerOption = Omit<StringOption, 'setAutocomplete'>;

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
  ): AnyServer {
    const name = option.apply(interaction);
    return name
      ? (OsuServers as unknown as Record<string, AnyServer>)[name] ??
          OsuServers.bancho
      : OsuServers.bancho;
  }

  protected async getUserFromServerUserOptions(
    options: OsuServerUserOptions,
    runner: IFurudeRunner<OsuContext>,
    user?: User | null
  ): Promise<IOsuUser<any> | undefined> {
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
    server: AnyServer,
    runner: IFurudeRunner<OsuContext>,
    username?: string | null,
    user: User = runner.interaction.user
  ): Promise<IOsuUser<any> | undefined> {
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
    user: IOsuUser<any>,
    fetchBeatmaps?: boolean,
    limit?: number
  ): Promise<IOsuScore[]> {
    return await user.fetchScores(
      this.getParamsForOsuUserRecentRequest(user, limit),
      fetchBeatmaps
    );
  }

  protected getParamsForOsuUserRequest(
    server: AnyServer,
    usernameID: string
  ): Partial<IBanchoOsuUserParams | IDroidOsuUserParam> {
    let params: Partial<IBanchoOsuUserParams | IDroidOsuUserParam> = {};
    params = OsuServerUtils.switchForParams(params, server, {
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
    user: IOsuUser<any>,
    limit?: number
  ) {
    let params: Partial<
      IBanchoOsuUserRecentParams | IDroidOsuUserRecentsParam
    > = {};
    params = OsuServerUtils.switchForParams(params, user.server, {
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
        limit: new OsuUserRecentsLimitBindable(
          limit ?? Number.POSITIVE_INFINITY
        ),
      },
    };
    return params;
  }

  protected getUserInfoAuthor(
    osuUser: IOsuUser<any>,
    runner: IFurudeRunner<OsuContext>
  ): MessageEmbedAuthor {
    const author: MessageEmbedAuthor = {
      name: `${osuUser.username}: ${osuUser.pps.raw.toLocaleString(
        runner.args!.localizer.language,
        {
          maximumFractionDigits: 2,
        }
      )}pp (#${osuUser.pps.global_rank} ${osuUser.country} #${
        osuUser.pps.country_rank
      })`,
      url: osuUser.getProfileUrl(),
    };
    return author;
  }
}
