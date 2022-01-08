import { CommandInteraction, CacheType, User } from 'discord.js';
import OsuContext from '../../../client/contexts/osu/OsuContext';
import FurudeRika from '../../../client/FurudeRika';
import CommandOptions from '../../../containers/CommandOptions';
import Strings from '../../../containers/Strings';
import FurudeSubCommand from '../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import ICommand from '../../../modules/framework/commands/interfaces/ICommand';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../../modules/framework/interactions/InteractionUtils';
import StringOption from '../../../modules/framework/options/classes/StringOption';
import IBanchoOsuUserParams from '../../../modules/osu/servers/implementations/bancho/params/IBanchoOsuUserParams';
import IDroidOsuUserParam from '../../../modules/osu/servers/implementations/droid/params/IDroidOsuUserParam';
import OsuServer from '../../../modules/osu/servers/OsuServer';
import OsuServers from '../../../modules/osu/servers/OsuServers';
import IOsuUser from '../../../modules/osu/users/IOsuUser';

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

  public getServerOptions(): OsuServerOption {
    return new StringOption()
      .setName(CommandOptions.server)
      .addChoices(OsuServers.servers.map((s) => [s.name, s.name]));
  }

  public getOsuUserOption() {
    return new StringOption().setName(CommandOptions.username);
  }

  public registerServerUserOptions(
    command: ICommand<FurudeRika, any>,
    setup: (o: OsuServerUserOptions) => void
  ): OsuServerUserOptions {
    const options = {
      user: command.registerOption(this.getOsuUserOption()),
      server: command.registerOption(this.getServerOptions()),
    };
    setup(options);
    return options;
  }

  public applyToServerOption(
    option: OsuServerOption,
    interaction: CommandInteraction
  ): OsuServer<any, any, any, any> {
    const name = option.apply(interaction);
    return name
      ? (
          OsuServers as unknown as Record<string, OsuServer<any, any, any, any>>
        )[name] ?? OsuServers.bancho
      : OsuServers.bancho;
  }

  public async getUserFromServerUserOptions(
    options: OsuServerUserOptions,
    runner: IFurudeRunner<OsuContext>,
    user?: User | null
  ): Promise<IOsuUser | undefined> {
    const server = this.applyToServerOption(options.server, runner.interaction);

    let username = options.user.apply(runner.interaction);

    if (!username) {
      if (user) {
        const dbOsuPlayer = await runner.args!.OSU_PLAYER.default(user);
        const dbUsername = dbOsuPlayer.getAccount(server);
        if (dbUsername) {
          username = dbUsername.toString();
        }
      }
    }

    if (!username) {
      username = Strings.EMPTY;
    }

    return await this.getUserFromServer(server, username);
  }

  public async sendOsuUserNotFound(runner: IFurudeRunner<OsuContext>) {
    await InteractionUtils.reply(
      runner.interaction,
      MessageCreator.error(
        runner.args!.localizer.get(FurudeTranslationKeys.OSU_ACCOUNT_NOT_FOUND)
      )
    );
  }

  public async getUserFromServer(
    server: OsuServer<any, any, any, any>,
    username: string
  ): Promise<IOsuUser | undefined> {
    return await server.users.get(
      this.getParamsForOsuUserRequest(server, username)
    );
  }

  public getParamsForOsuUserRequest(
    server: OsuServer<any, any, any, any>,
    usernameID: string
  ): any {
    let params = {};
    switch (server.name) {
      case OsuServers.bancho.name:
        let banchoParams: Partial<IBanchoOsuUserParams> = {
          u: usernameID,
        };
        params = banchoParams;
        break;
      case OsuServers.droid.name:
        let droidParams: Partial<IDroidOsuUserParam> = {
          uid: parseInt(usernameID),
        };
        params = droidParams;
        break;
    }
    return params;
  }
}
