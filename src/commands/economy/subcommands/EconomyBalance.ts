import CommandOptions from '../../../containers/CommandOptions';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import UserOption from '../../../modules/framework/options/classes/UserOption';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import EconomySubCommand from '../wrapper/EconomySubCommand';
import InteractionUtils from '../../../modules/framework/interactions/InteractionUtils';
import CurrencyContext from '../../../client/contexts/currency/CurrencyContext';

export default class EconomyOpen extends EconomySubCommand {
  private readonly user = this.registerOption(
    new UserOption(true)
      .setName(CommandOptions.user)
      .setDescription(
        'The user you want to obtain the balance information from.'
      )
  );

  public constructor() {
    super({
      name: 'balance',
      description: `Check information about your's or someone else ${CurrencyContainer.CURRENCY_NAME} account`,
    });
  }

  public async trigger(context: CurrencyContext): Promise<void> {
    const { interaction, localizer } = context;

    const selectedUser = this.user.apply(interaction)!;
    const citizen = await context.CITIZENS.default(selectedUser);

    if (citizen.justCreated) {
      await InteractionUtils.reply(
        interaction,
        MessageCreator.error(
          localizer.get(FurudeTranslationKeys.ECONOMY_BALANCE_FAIL)
        )
      );
      return;
    }

    let responseObject = {
      name: selectedUser.username,
      global_capital: citizen.capital!.global,
    };

    if (interaction.guild) {
      responseObject = {
        ...responseObject,
        ...{
          local_capital: citizen.capital!.currentLocal(interaction.guild),
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
