import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultDependency from '../../client/providers/DefaultDependency';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';
import IRunsCommand from '../../framework/commands/interfaces/IRunsCommand';
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
    runner: IFurudeRunner<DefaultDependency>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const selectedCoin = ArrayHelper.getRandomArrayElement(this.coinsArray);
      await interaction.reply({
        content: MessageFactory.success(
          runner.args!.localizer.get(FurudeTranslationKeys.COIN_FLIP_RESULT, {
            values: {
              args: [
                runner.args!.localizer.get(
                  selectedCoin as unknown as FurudeTranslationKeys
                ),
              ],
            },
          })
        ),
      });
    };
  }
}
