import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import FurudeCommand from '../../discord/FurudeCommand';
import ArrayHelper from '../../framework/helpers/ArrayHelper';
import MessageFactory from '../../helpers/MessageFactory';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';

enum COIN {
  HEAD = FurudeTranslationKeys.COIN_FLIP_HEADS,
  TAILS = FurudeTranslationKeys.COIN_FLIP_TAILS,
}

export default class CoinFlip extends FurudeCommand {
  private readonly coinsArray = [COIN.HEAD, COIN.TAILS];

  public constructor() {
    super({
      name: 'coinflip',
      description: "Flips a coin, will it land on head or tails, let's see?",
    });
  }

  public createRunnerRunnable(
    client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const selectedCoin = ArrayHelper.getRandomArrayElement(this.coinsArray);
      await interaction.reply({
        content: MessageFactory.success(
          await client.localizer.get(FurudeTranslationKeys.COIN_FLIP_RESULT, {
            discord: {
              interaction,
            },
            values: {
              args: [
                await client.localizer.get(
                  selectedCoin as unknown as FurudeTranslationKeys,
                  {
                    discord: {
                      interaction,
                    },
                  }
                ),
              ],
            },
          })
        ),
      });
    };
  }
}
