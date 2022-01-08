import { secondsToHours } from 'date-fns';
import { CommandInteraction, CacheType } from 'discord.js';
import OsuContext from '../../../client/contexts/osu/OsuContext';
import FurudeRika from '../../../client/FurudeRika';
import CommandOptions from '../../../containers/CommandOptions';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import { MessageButtonCreator } from '../../../modules/framework/creators/MessageButtonCreator';
import MessageButtonFactory from '../../../modules/framework/creators/MessageButtonFactory';
import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../../modules/framework/interactions/InteractionUtils';

import UserOption from '../../../modules/framework/options/classes/UserOption';
import IOsuUser from '../../../modules/osu/users/IOsuUser';
import OsuSubCommand from '../wrapper/OsuSubCommand';

export default class OsuProfile extends OsuSubCommand {
  private serverUserOptions = this.registerServerUserOptions(this, (o) => {
    o.server.setDescription('The server of the account you want to view.');
    o.user.setDescription('The username of the account you want to view.');
  });

  private discordUserOption = this.registerOption(
    new UserOption(true)
      .setName(CommandOptions.user)
      .setDescription('The user who owns the account you want to view.')
  );

  public constructor() {
    super({
      name: 'profile',
      description: 'Views a user osu! profile.',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<OsuContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const discordUser = this.discordUserOption.apply(interaction);
      const osuUser = await this.getUserFromServerUserOptions(
        this.serverUserOptions,
        runner,
        discordUser
      );

      if (!osuUser) {
        await this.sendOsuUserNotFound(runner);
        return;
      }

      const minimizedEmbed = this.getMinimizedEmbed(osuUser, runner);
      const expandedEmbed = this.getExpandedEmbed(osuUser, runner);

      const buttonFactory = new MessageButtonFactory();

      await MessageButtonCreator.createBaseButtonCollectors(
        [
          {
            button: buttonFactory
              .newButton()
              .setStyle('SUCCESS')
              .setLabel('Expand'),
            onPress: async (i) => {
              await InteractionUtils.safeUpdate(i, {
                embeds: [expandedEmbed],
              });
            },
          },
          {
            button: buttonFactory
              .newButton()
              .setStyle('SUCCESS')
              .setLabel('Minimize'),
            onPress: async (i) => {
              await InteractionUtils.safeUpdate(i, {
                embeds: [minimizedEmbed],
              });
            },
          },
        ],
        interaction,
        { embeds: [minimizedEmbed] },
        [interaction.user.id],
        60
      );
    };
  }

  private createBaseEmbed(
    osuUser: IOsuUser,
    runner: IFurudeRunner<OsuContext>
  ) {
    return new BaseEmbed({}, runner.interaction).setTitle(
      `${osuUser.username}: ${osuUser.pps.raw.toLocaleString(
        runner.args!.localizer.language,
        {
          maximumFractionDigits: 2,
        }
      )}pp (#${osuUser.pps.global_rank} ${osuUser.country} #${
        osuUser.pps.country_rank
      })`
    );
  }

  private getMinimizedEmbed(
    osuUser: IOsuUser,
    runner: IFurudeRunner<OsuContext>
  ): BaseEmbed {
    return this.createBaseEmbed(osuUser, runner).setDescription(
      `Accuracy: ${`${MessageCreator.block(
        osuUser.accuracy.toFixed(2)
      )}%`} • Level: ${MessageCreator.block(
        osuUser.level.toFixed(2)
      )}\nPlaycount: ${MessageCreator.block(
        osuUser.counts.plays.toLocaleString(runner.args!.localizer.language)
      )} (${secondsToHours(osuUser.total_seconds_played)} hrs)`
    );
  }

  private getExpandedEmbed(
    osuUser: IOsuUser,
    runner: IFurudeRunner<OsuContext>
  ): BaseEmbed {
    return this.createBaseEmbed(osuUser, runner)
      .setDescription(MessageCreator.bold('osu! statistics:'))
      .addFields([
        {
          name: 'Ranked score',
          value: osuUser.scores.ranked.toLocaleString(
            runner.args!.localizer.language
          ),
        },
        {
          name: 'Accuracy',
          value: osuUser.accuracy.toFixed(2),
        },
        {
          name: 'Total score',
          value: osuUser.scores.total.toLocaleString(
            runner.args!.localizer.language
          ),
        },
        { name: 'Level', value: osuUser.level.toFixed(2) },
        {
          name: 'Play count / Time',
          value: `${osuUser.counts.plays.toLocaleString(
            runner.args!.localizer.language
          )} / ${secondsToHours(osuUser.total_seconds_played)}`,
        },
      ]);
  }
}
