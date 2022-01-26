import CommandOptions from '../../../containers/CommandOptions';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import BaseEmbed from '../../../discord/embeds/BaseEmbed';
import MessageCreator from '../../../utils/MessageCreator';
import EconomySubCommand from '../wrapper/EconomySubCommand';
import type CurrencyContext from '../../../contexts/currency/CurrencyContext';
import { UserOption, assertDefined, InteractionUtils } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';

type Args = {
  user: UserOption;
};

@CommandInformation({
  name: 'balance',
  description: `Check information about your's or someone else ${CurrencyContainer.CURRENCY_NAME} account`,
})
export default class EconomyOpen extends EconomySubCommand<Args> {
  public createArguments(): Args {
    return {
      user: new UserOption(true)
        .setName(CommandOptions.user)
        .setDescription(
          'The user you want to obtain the balance information from.'
        ),
    };
  }

  public async trigger(context: CurrencyContext<Args>): Promise<void> {
    const { interaction, args } = context;
    const { localizer } = context.client;
    const { user } = args;

    assertDefined(user);

    const dbUser = await context.USERS.default(user);
    const { citizen } = dbUser;

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
