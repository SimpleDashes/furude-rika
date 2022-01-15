import type DefaultContext from '../../../../../client/contexts/DefaultContext';
import CommandOptions from '../../../../../containers/CommandOptions';
import DBGuild from '../../../../../database/entity/DBGuild';
import FurudeOperations from '../../../../../database/FurudeOperations';
import FurudeSubCommand from '../../../../../discord/commands/FurudeSubCommand';
import {
  Preconditions,
  SetPreconditions,
} from '../../../../../modules/framework/preconditions/PreconditionDecorators';
import BaseEmbed from '../../../../../modules/framework/embeds/BaseEmbed';
import IntegerOption from '../../../../../modules/framework/options/classes/IntegerOption';
import MessageCreator from '../../../../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../../../../modules/framework/interactions/InteractionUtils';
import type { TypedArgs } from '../../../../../modules/framework/commands/contexts/types';
import type IDatabaseOperation from '../../../../../database/interfaces/IDatabaseOperation';
import { assertDefined } from '../../../../../modules/framework/types/TypeAssertions';

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

@SetPreconditions(
  Preconditions.GuildOnly,
  Preconditions.WithPermission('ADMINISTRATOR')
)
export default class CustomizeMinXP extends FurudeSubCommand<
  DefaultContext<TypedArgs<Args>>,
  Args
> {
  public createArgs(): Args {
    return {
      min: new XPChangeOption()
        .setName(CommandOptions.min)
        .setDescription('The minimal rewarded experience for this guild.'),
      max: new XPChangeOption()
        .setName(CommandOptions.max)
        .setDescription('The maximum rewarded experience for this guild.'),
    };
  }

  public constructor() {
    super({
      name: 'rewarded_experience',
      description:
        'Customizes how much users are rewarded with experience on this guild.',
    });
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
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
