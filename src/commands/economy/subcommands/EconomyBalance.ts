import { CommandInteraction, CacheType } from 'discord.js';

import FurudeRika from '../../../client/FurudeRika';
import CommandOptions from '../../../containers/CommandOptions';
import CurrencyContainer from '../../../containers/CurrencyContainer';
import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import UserOption from '../../../modules/framework/options/classes/UserOption';
import MessageCreator from '../../../modules/framework/helpers/MessageCreator';
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
          content: MessageCreator.error(
            runner.args!.localizer.get(
              FurudeTranslationKeys.ECONOMY_BALANCE_FAIL
            )
          ),
        });
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

      await interaction.editReply({
        embeds: [embed],
      });
    };
  }
}
