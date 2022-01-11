import DefaultContext from '../../../../../client/contexts/DefaultContext';
import CommandOptions from '../../../../../containers/CommandOptions';
import DBGuild from '../../../../../database/entity/DBGuild';
import FurudeOperations from '../../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/commands/decorators/PreconditionDecorators';
import BaseEmbed from '../../../../../modules/framework/embeds/BaseEmbed';
import IntegerOption from '../../../../../modules/framework/options/classes/IntegerOption';
import MessageCreator from '../../../../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../../../../modules/framework/interactions/InteractionUtils';
import assert from 'assert';

class XPChangeOption extends IntegerOption {
  public constructor() {
    super();
    this.setMinValue(DBGuild.MIN_XP_CHANGE_VALUE).setMaxValue(
      DBGuild.MAX_XP_CHANGE_VALUE
    );
  }
}

@SetPreconditions(
  Preconditions.GuildOnly,
  Preconditions.WithPermission('ADMINISTRATOR')
)
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

  public async trigger(context: DefaultContext): Promise<void> {
    const { interaction, dbGuild } = context;

    assert(dbGuild);

    const minValue = this.minOption.apply(interaction);
    const maxValue = this.maxOption.apply(interaction);

    const operations = [];

    if (minValue) {
      operations.push(dbGuild.setMinXPValue(minValue));
    }

    if (maxValue) {
      operations.push(dbGuild!.setMaxXPValue(maxValue));
    }

    await FurudeOperations.saveWhenSuccess(dbGuild, ...operations);

    const embed = new BaseEmbed(
      {
        title: MessageCreator.bold('XP Rewarding settings'),
        description: MessageCreator.blockQuote(
          MessageCreator.bold(
            MessageCreator.objectToKeyValueString({
              minimal_xp: dbGuild.min_rewarded_xp_value,
              maximal_xp: dbGuild.max_rewarded_xp_value,
            })
          )
        ),
      },
      interaction
    );

    await InteractionUtils.reply(interaction, {
      embeds: [embed],
    });
  }
}
