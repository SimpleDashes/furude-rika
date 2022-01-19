import type DefaultContext from '../../../../../contexts/DefaultContext';
import CommandOptions from '../../../../../containers/CommandOptions';
import DBGuild from '../../../../../database/entity/DBGuild';
import FurudeOperations from '../../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import { assertDefined } from 'discowork/src/assertions';
import IntegerOption from 'discowork/src/options/classes/IntegerOption';
import InteractionUtils from 'discowork/src/utils/InteractionUtils';
import type IDatabaseOperation from '../../../../../database/interfaces/IDatabaseOperation';
import BaseEmbed from '../../../../../modules/framework/embeds/BaseEmbed';
import MessageCreator from '../../../../../modules/framework/helpers/MessageCreator';
import { CommandInformation } from 'discowork/src/commands/decorators';

class XPChangeOption extends IntegerOption {
  public constructor() {
    super();
    this.setMinValue(DBGuild.MIN_XP_CHANGE_VALUE).setMaxValue(
      DBGuild.MAX_XP_CHANGE_VALUE
    );
  }
}

type Args = {
  min: XPChangeOption;
  max: XPChangeOption;
};

@CommandPreconditions(
  Preconditions.GuildOnly,
  Preconditions.WithPermission('ADMINISTRATOR')
)
@CommandInformation({
  name: 'rewarded_experience',
  description:
    'Customizes how much users are rewarded with experience on this guild.',
})
export default class CustomizeMinXP extends FurudeSubCommand<
  Args,
  DefaultContext<Args>
> {
  public createArguments(): Args {
    return {
      min: new XPChangeOption()
        .setName(CommandOptions.min)
        .setDescription('The minimal rewarded experience for this guild.'),
      max: new XPChangeOption()
        .setName(CommandOptions.max)
        .setDescription('The maximum rewarded experience for this guild.'),
    };
  }

  public async trigger(context: DefaultContext<Args>): Promise<void> {
    const { interaction, dbGuild, args } = context;
    const { min, max } = args;

    assertDefined(dbGuild);

    const operations: IDatabaseOperation[] = [];
    const addXPChangeOperation = (
      value: number | undefined,
      operationFunction: (value: number) => IDatabaseOperation
    ): void => {
      if (value) {
        operations.push(operationFunction(value));
      }
    };

    addXPChangeOperation(min, dbGuild.setMinXPValue);
    addXPChangeOperation(max, dbGuild.setMaxXPValue);

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
