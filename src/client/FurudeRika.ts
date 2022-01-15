import { BaseGuildTextChannel } from 'discord.js';
import BaseBot from '../modules/framework/client/BaseBot';
import consola from 'consola';
import type ICommandRunResponse from '../modules/framework/client/ICommandRunResponse';
import DeployHandler from '../modules/framework/rest/DeployHandler';
import DirectoryMapperFactory from '../modules/framework/io/DirectoryMapperFactory';
import path from 'path';
import FurudeLocales from '../localization/FurudeLocales';
import FurudeDB from '../database/FurudeDB';
import type DefaultContext from './contexts/DefaultContext';
import FurudeOperations from '../database/FurudeOperations';
import ReminderManager from './managers/ReminderManager';
import UserScanner from './managers/UserScanner';
import OsuServers from '../modules/osu/servers/OsuServers';
import { secondsToMilliseconds } from 'date-fns';
import BeatmapCacheManager from './managers/BeatmapCacheManager';
import { Preconditions } from '../modules/framework/preconditions/PreconditionDecorators';
import type CommandPrecondition from '../modules/framework/preconditions/abstracts/CommandPrecondition';
import FurudeTranslationKeys from '../localization/FurudeTranslationKeys';
import GuildPermissionsPrecondition from '../modules/framework/preconditions/GuildPermissionsPreconditions';
import MessageCreator from '../modules/framework/helpers/MessageCreator';
import { assertDefined } from '../modules/framework/types/TypeAssertions';
import type { IncrementLocalUserExperienceInfo } from '../database/entity/DBUser';
import type { TypedArgs } from '../modules/framework/commands/contexts/types';

export default class FurudeRika extends BaseBot<
  DefaultContext<TypedArgs<unknown>>
> {
  public readonly db = new FurudeDB();
  public readonly localizer = new FurudeLocales();
  public readonly reminderManager = new ReminderManager(this);
  public readonly userScanner = new UserScanner(this);
  public readonly beatmapCache = new BeatmapCacheManager(this);

  readonly #forceDeploy = true;
  readonly #isDebug = true;

  public constructor() {
    FurudeRika.init();
    super(
      {
        intents: ['GUILDS', 'GUILD_MESSAGES'],
      },
      {
        ENV_TOKEN_VAR: 'BOT_TOKEN',
        ENV_DEVELOPMENT_SERVER: 'DEV_GUILD_ID',
        OWNER_IDS: ['902963589898444800'],
      },
      new DirectoryMapperFactory(path.join('dist', 'commands'), [
        'subcommands',
        'groups',
        'wrapper',
      ])
    );

    this.#setupMemoryLogger();
    this.#setupPreconditions();
  }

  /**
   * Starts things that are necessary before calling super() on the bot.
   */
  public static init(): void {
    OsuServers.build({
      bancho_api_key: process.env.BANCHO_API_KEY,
    });
  }

  #setupPreconditions(): void {
    const setupCondition = (
      condition: CommandPrecondition,
      key: FurudeTranslationKeys
    ): void => {
      (
        condition as CommandPrecondition<DefaultContext<unknown>>
      ).onFailMessage = (ctx): string =>
        MessageCreator.fail(ctx.localizer.get(key));
    };

    setupCondition(
      Preconditions.OwnerOnly,
      FurudeTranslationKeys.ERROR_OWNER_ONLY_COMMAND
    );

    setupCondition(
      Preconditions.GuildOnly,
      FurudeTranslationKeys.ERROR_REQUIRES_GUILD
    );

    setupCondition(
      Preconditions.RequiresSubCommand,
      FurudeTranslationKeys.SUBCOMMAND_MISSING_REQUIRED
    );

    Preconditions.WithPermission = (
      permissions
    ): GuildPermissionsPrecondition => {
      const condition = new GuildPermissionsPrecondition(permissions);
      setupCondition(
        condition,
        FurudeTranslationKeys.ERROR_MISSING_PERMISSIONS
      );
      return condition;
    };
  }

  #setupMemoryLogger(): void {
    setInterval(() => {
      const bytesToMegabytes = (bytes: number): number => {
        return bytes / 1024 / 1024;
      };
      consola.success(
        `Memory usage: ${bytesToMegabytes(
          process.memoryUsage().heapUsed
        ).toFixed()}MB`
      );
    }, secondsToMilliseconds(60));
  }

  public override async start(): Promise<void> {
    await super.start();
    await this.localizer.build();
    await this.db.connect();

    await this.reminderManager.setupReminders();
    this.userScanner.startScan();

    this.on('messageCreate', async (message) => {
      if (
        !message.guild ||
        !message.member ||
        message.member.user.bot ||
        !message.inGuild() ||
        !(message.channel instanceof BaseGuildTextChannel)
      )
        return;
      const user = await this.db.USER.findOne(message.member.user);
      user.setUsername(message.member.user.username);
      const operation = user.incrementExperience(message.member.user, {
        rawGuild: message.guild,
        dbGuild: await this.db.GUILD.findOne(message.guild),
        channel: message.channel,
      });
      if (operation.successfully) {
        consola.success(operation.response);
      }
      await FurudeOperations.saveWhenSuccess(user, operation);
    });
  }

  public override async beforeCommandRun(
    response: ICommandRunResponse<DefaultContext<TypedArgs<unknown>>>
  ): Promise<void> {
    const { context } = response;
    const { interaction } = context;
    await interaction.deferReply();
  }

  public override async onCommandRun(
    response: ICommandRunResponse<DefaultContext<TypedArgs<unknown>>>
  ): Promise<void> {
    const { command, context } = response;
    const { interaction, dbUser, dbGuild } = context;

    dbUser.incrementExperience(
      interaction.user,
      interaction.inGuild() &&
        interaction.channel instanceof BaseGuildTextChannel
        ? ((): IncrementLocalUserExperienceInfo => {
            assertDefined(interaction.guild);
            assertDefined(dbGuild);
            assertDefined(interaction.channel);
            return {
              rawGuild: interaction.guild,
              dbGuild: dbGuild,
              channel: interaction.channel,
            };
          })()
        : undefined
    );

    consola.success(
      `Command "${
        command.information.name
      }" was ran, requested by: ${interaction.user.toString()} on channel: ${
        interaction.channel?.id
      } on server: ${interaction.guild?.name}`
    );
  }

  public override async onCommandsLoaded(): Promise<void> {
    consola.log(this.commands.size + ' commands were loaded');
    if (!this.#forceDeploy) return;
    await DeployHandler.deployAll<DefaultContext<TypedArgs<unknown>>>(
      this,
      this.#isDebug,
      {
        onError: () => {
          consola.error(`Error deploying all commands`);
        },
        onSuccess: () => {
          consola.success(`Deployed all commands`);
        },
      }
    );
  }
}
