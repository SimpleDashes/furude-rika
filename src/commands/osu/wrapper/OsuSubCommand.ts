import type { User, MessageEmbedAuthor } from 'discord.js';
import OsuContext from '../../../client/contexts/osu/OsuContext';
import CommandOptions from '../../../containers/CommandOptions';
import Strings from '../../../containers/Strings';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import type ICommandContext from '../../../modules/framework/commands/contexts/ICommandContext';
import type { TypedArgs } from '../../../modules/framework/commands/decorators/ContextDecorators';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../../modules/framework/interactions/InteractionUtils';
import StringOption from '../../../modules/framework/options/classes/StringOption';
import UserOption from '../../../modules/framework/options/classes/UserOption';
import OsuUserRecentsLimitBindable from '../../../modules/osu/bindables/OsuUserRecentsLimitBindable';
import type IOsuScore from '../../../modules/osu/scores/IOsuScore';
import type IBanchoOsuUserParams from '../../../modules/osu/servers/implementations/bancho/params/IBanchoOsuUserParams';
import type IBanchoOsuUserRecentParams from '../../../modules/osu/servers/implementations/bancho/params/IBanchoOsuUserRecentParams';
import type IDroidOsuUserParam from '../../../modules/osu/servers/implementations/droid/params/IDroidOsuUserParam';
import type IDroidOsuUserRecentsParam from '../../../modules/osu/servers/implementations/droid/params/IDroidOsuUserRecentsParams';
import type { AnyServer } from '../../../modules/osu/servers/OsuServers';
import OsuServers from '../../../modules/osu/servers/OsuServers';
import type IOsuUser from '../../../modules/osu/users/IOsuUser';
import OsuServerUtils from '../../../utils/OsuServerUtils';

type OsuServerOption = Omit<StringOption, 'setAutocomplete'>;

export type OsuServerUserOptions = {
  username: StringOption;
  server: OsuServerOption;
};

export type OsuServerUserOptionWithDiscord = OsuServerUserOptions & {
  discordUser: UserOption;
};

export default abstract class OsuSubCommand<A> extends FurudeSubCommand<
  OsuContext<TypedArgs<A>>,
  A
> {
  protected getServerOptions(): OsuServerOption {
    return new StringOption()
      .setName(CommandOptions.server)
      .addChoices(OsuServers.servers.map((s) => [s.name, s.name]));
  }

  protected getOsuUserOption(): StringOption {
    return new StringOption().setName(CommandOptions.username);
  }

  protected getOsuServerUserOptions(): OsuServerUserOptions {
    return {
      username: this.getOsuUserOption(),
      server: this.getServerOptions(),
    };
  }

  protected getOsuServerOptionsWithDiscordUser(): OsuServerUserOptionWithDiscord {
    return {
      ...this.getOsuServerUserOptions(),
      ...{
        discordUser: new UserOption(true).setName(CommandOptions.user),
      },
    };
  }

  protected applyToServerOption(
    context: OsuContext<TypedArgs<A & OsuServerUserOptions>>
  ): AnyServer {
    const { args } = context;
    const { server } = args;
    return server
      ? (OsuServers as unknown as Record<string, AnyServer>)[
          server.toString()
        ] ?? OsuServers.bancho
      : OsuServers.bancho;
  }

  protected async sendOsuUserNotFound(
    context: OsuContext<TypedArgs<A>>
  ): Promise<void> {
    const { interaction, localizer } = context;
    await InteractionUtils.reply(
      interaction,
      MessageCreator.error(
        localizer.get(FurudeTranslationKeys.OSU_ACCOUNT_NOT_FOUND)
      )
    );
  }

  protected async getUserFromServer(
    context: OsuContext<TypedArgs<A & OsuServerUserOptions>>,
    user: User = context.interaction.user,
    server: AnyServer = this.applyToServerOption(context),
    username: string | null = context.args.username as string
  ): Promise<IOsuUser<unknown> | undefined> {
    if (!username) {
      const dbOsuPlayer = await context.OSU_PLAYER.default(user);
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
    user: IOsuUser<unknown>,
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
    user: IOsuUser<unknown>,
    limit?: number
  ): IBanchoOsuUserRecentParams | IDroidOsuUserRecentsParam {
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
    return params as IBanchoOsuUserRecentParams | IDroidOsuUserRecentsParam;
  }

  protected getUserInfoAuthor(
    osuUser: IOsuUser<unknown>,
    context: OsuContext<TypedArgs<A>>
  ): MessageEmbedAuthor {
    const { localizer } = context;
    const author: MessageEmbedAuthor = {
      name: `${osuUser.username}: ${osuUser.pps.raw.toLocaleString(
        localizer.Language,
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

  public override createContext(
    baseContext: ICommandContext
  ): OsuContext<TypedArgs<A>> {
    return new OsuContext(baseContext);
  }
}
