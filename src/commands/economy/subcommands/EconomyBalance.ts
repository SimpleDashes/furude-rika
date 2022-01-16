import CommandOptions from '../../../containers/CommandOptions';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import UserOption from '../../../modules/framework/options/classes/UserOption';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import EconomySubCommand from '../wrapper/EconomySubCommand';
import InteractionUtils from '../../../modules/framework/interactions/InteractionUtils';
import type CurrencyContext from '../../../client/contexts/currency/CurrencyContext';
import { assertDefined } from '../../../modules/framework/types/TypeAssertions';
import type { TypedArgs } from '../../../modules/framework/commands/contexts/types';

type Args = {
  user: UserOption;
};
export default class EconomyOpen extends EconomySubCommand<Args> {
  public createArgs(): Args {
    return {
      user: new UserOption(true)
        .setName(CommandOptions.user)
        .setDescription(
          'The user you want to obtain the balance information from.'
        ),
    };
  }

  public constructor() {
    super({
      name: 'balance',
      description: `Check information about your's or someone else ${CurrencyContainer.CURRENCY_NAME} account`,
    });
  }

  public async trigger(
    context: CurrencyContext<TypedArgs<Args>>
  ): Promise<void> {
    const { interaction, args } = context;
    const { localizer } = context.client;
    const { user } = args;

    assertDefined(user);

    const citizen = await context.CITIZENS.default(user);

    if (citizen.justCreated) {
      await InteractionUtils.reply(
        interaction,
        MessageCreator.fail(
          localizer.getTranslationFromContext(
            context,
            (k) => k.economy.balance.fail,
            {
              CURRENCY_NAME: CurrencyContainer.CURRENCY_NAME,
            }
          )
        )
      );
      return;
    }

    let responseObject = {
      name: user.username,
      global_capital: citizen.capital.global,
    };

    if (interaction.guild) {
      responseObject = {
        ...responseObject,
        ...{
          local_capital: citizen.capital.currentLocal(interaction.guild),
        },
      };
    }

    const embed = new BaseEmbed(
      {
        title: MessageCreator.bold(
          MessageCreator.underLine(CurrencyContainer.CURRENCY_NAME)
        ),
        description: MessageCreator.blockQuote(
          MessageCreator.bold(
            MessageCreator.objectToKeyValueString(responseObject)
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
