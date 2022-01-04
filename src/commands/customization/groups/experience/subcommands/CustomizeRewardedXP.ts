import { CommandInteraction, CacheType } from 'discord.js';
import DefaultContext from '../../../../../client/contexts/DefaultContext';
import FurudeRika from '../../../../../client/FurudeRika';
import CommandOptions from '../../../../../containers/CommandOptions';
import DBGuild from '../../../../../database/entity/DBGuild';
import FurudeOperations from '../../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import IFurudeRunner from '../../../../../discord/commands/interfaces/IFurudeRunner';
import {
  RequirePermissions,
  RequiresGuild,
} from '../../../../../framework/commands/decorators/PreconditionDecorators';
import BaseEmbed from '../../../../../framework/embeds/BaseEmbed';
import IntegerOption from '../../../../../framework/options/classes/IntegerOption';
import MessageFactory from '../../../../../helpers/MessageFactory';

class XPChangeOption extends IntegerOption {
  public constructor() {
    super();
    this.setMinValue(DBGuild.MIN_XP_CHANGE_VALUE).setMaxValue(
      DBGuild.MAX_XP_CHANGE_VALUE
    );
  }
}

@RequiresGuild
@RequirePermissions(['ADMINISTRATOR'])
export default class CustomizeMinXP extends FurudeSubCommand {
  private minOption = this.registerOption(
    new XPChangeOption()
      .setName(CommandOptions.min)
      .setDescription('The minimal rewarded experience for this guild.')
  );

  private maxOption = this.registerOption(
    new XPChangeOption()
      .setName(CommandOptions.max)
      .setDescription('The maximum rewarded experience for this guild.')
  );

  public constructor() {
    super({
      name: 'rewarded_experience',
      description:
        'Customizes how much users are rewarded with experience on this guild.',
    });
  }

  public createRunnerRunnable(
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const minValue = this.minOption.apply(interaction);
      const maxValue = this.maxOption.apply(interaction);

      const operations = [];

      if (minValue) {
        operations.push(runner.args!.dbGuild!.setMinXPValue(minValue));
      }

      if (maxValue) {
        operations.push(runner.args!.dbGuild!.setMaxXPValue(maxValue));
      }

      await FurudeOperations.saveWhenSuccess(
        runner.args!.dbGuild!,
        ...operations
      );

      const embed = new BaseEmbed({
        title: MessageFactory.bold('XP Rewarding settings'),
        description: MessageFactory.blockQuote(
          MessageFactory.bold(
            MessageFactory.objectToKeyValueString({
              minimal_xp: runner.args!.dbGuild!.min_rewarded_xp_value,
              maximal_xp: runner.args!.dbGuild!.max_rewarded_xp_value,
            })
          )
        ),
      });

      await interaction.editReply({
        embeds: [embed],
      });
    };
  }
}
