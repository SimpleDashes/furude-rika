import { secondsToMilliseconds } from 'date-fns';
import { BaseGuildTextChannel } from 'discord.js';
import FurudeDB from '../database/FurudeDB';
import FurudeOperations from '../database/FurudeOperations';
import FurudeLocalizer from '../localization/FurudeLocalizer';
import type FurudeResourceStructure from '../localization/FurudeResourceStructure';
import MessageCreator from '../utils/MessageCreator';
import OsuServers from '../modules/osu/servers/OsuServers';
import BeatmapCacheManager from '../managers/BeatmapCacheManager';
import ReminderManager from '../managers/ReminderManager';
import DefaultContext from '../contexts/DefaultContext';
import UserScanner from '../managers/UserScanner';
import assert from 'assert';
import type { IncrementLocalUserExperienceInfo } from '../database/entity/DBUser';
import type { CommandPrecondition, ResourceValue } from 'discowork';
import {
  SimpleClient,
  Preconditions,
  GuildPermissionsPrecondition,
  Logger,
  assertDefined,
} from 'discowork';

export default class FurudeRika extends SimpleClient {
  public readonly localizer = new FurudeLocalizer();

  public readonly db = new FurudeDB();
  public readonly reminderManager = new ReminderManager(this);
  public readonly userScanner = new UserScanner(this);
  public readonly beatmapCache = new BeatmapCacheManager(this);

  public constructor() {
    FurudeRika.init();
    super({
      intents: ['GUILDS', 'GUILD_MESSAGES'],
      token: process.env['BOT_TOKEN'],
      developmentGuild: process.env['DEV_GUILD_ID'],
      ownerIDS: ['902963589898444800'],
    });
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
      key: (structure: FurudeResourceStructure) => ResourceValue
    ): void => {
      (condition as CommandPrecondition).onFailMessage = (ctx): string =>
        MessageCreator.fail(
          this.localizer.getTranslationFromContext(
            // TODO FIX TYPING, .... generics.....
            ctx as DefaultContext<unknown>,
            key,
            {}
          )
        );
    };

    setupCondition(Preconditions.OwnerOnly, (k) => k.command.error.owner_only);

    setupCondition(
      Preconditions.GuildOnly,
      (k) => k.command.error.requires_guild
    );

    setupCondition(
      Preconditions.RequiresSubCommand,
      (k) => k.command.subcommand.error.required
    );

    Preconditions.WithPermission = (
      permissions
    ): GuildPermissionsPrecondition => {
      const condition = new GuildPermissionsPrecondition(permissions);
      setupCondition(condition, (s) => s.command.error.missing_permissions);
      return condition;
    };
  }

  #setupMemoryLogger(): void {
    setInterval(() => {
      const bytesToMegabytes = (bytes: number): number => {
        return bytes / 1024 / 1024;
      };
      Logger.success(
        `Memory usage: ${bytesToMegabytes(
          process.memoryUsage().heapUsed
        ).toFixed()}MB`
      );
    }, secondsToMilliseconds(60));
  }

  public override async onceLogin(): Promise<void> {
    await super.onceLogin();
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
        Logger.success(operation.response);
      }
      await FurudeOperations.saveWhenSuccess(user, operation);
    });
    this.commandProcessor.beforeCommandTrigger = async (
      context
    ): Promise<void> => {
      await context.interaction.deferReply({ fetchReply: true });
    };
    this.commandProcessor.afterCommandTrigger = async (
      context
    ): Promise<void> => {
      assert(context instanceof DefaultContext);

      const { interaction, dbUser, dbGuild } = context;

      const operation = dbUser.incrementExperience(
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

      if (operation.successfully) {
        Logger.success(operation.response);
      }

      await FurudeOperations.saveWhenSuccess(dbUser, operation);
    };
  }
}
