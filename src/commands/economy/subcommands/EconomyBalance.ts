import { CommandInteraction, CacheType } from 'discord.js';
import CurrencyContext from '../../../client/contexts/currency/CurrencyContext';

import FurudeRika from '../../../client/FurudeRika';
import CommandOptions from '../../../containers/CommandOptions';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import IFurudeRunner from '../../../discord/commands/interfaces/IFurudeRunner';
import BaseEmbed from '../../../framework/embeds/BaseEmbed';
import UserOption from '../../../framework/options/classes/UserOption';
import MessageFactory from '../../../helpers/MessageFactory';
import FurudeTranslationKeys from '../../../localization/FurudeTranslationKeys';
import EconomySubCommand, { EconomyRunner } from '../wrapper/EconomySubCommand';

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

  public createRunnerRunnableInternally(
    runner: EconomyRunner,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      await interaction.deferReply();

      const selectedUser = this.user.apply(interaction)!;

      const citizen = await runner.getCitizen(selectedUser);

      if (citizen.justCreated) {
        await interaction.editReply({
          content: MessageFactory.error(
            runner.args!.localizer.get(
              FurudeTranslationKeys.ECONOMY_BALANCE_FAIL
            )
          ),
        });
        return;
      }

      const embed = new BaseEmbed(
        {
          title: MessageFactory.bold(
            MessageFactory.underLine(CurrencyContainer.CURRENCY_NAME)
          ),
          description: MessageFactory.blockQuote(
            MessageFactory.bold(
              MessageFactory.objectToKeyValueString({
                name: selectedUser.username,
                balance: citizen.capital,
              })
            )
          ),
        },
        interaction
      );

      await interaction.editReply({
        embeds: [embed],
      });
    };
  }
}
