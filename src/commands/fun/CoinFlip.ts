import { CommandInteraction, CacheType } from 'discord.js';
import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import IFurudeRunner from '../../discord/commands/interfaces/IFurudeRunner';
import ArrayHelper from '../../modules/framework/helpers/ArrayHelper';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';

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
    runner: IFurudeRunner<DefaultContext>,
    _client: FurudeRika,
    interaction: CommandInteraction<CacheType>
  ): () => Promise<void> {
    return async () => {
      const selectedCoin = ArrayHelper.getRandomArrayElement(this.coinsArray);
      await InteractionUtils.reply(
        interaction,
        MessageCreator.success(
          runner.args!.localizer.get(FurudeTranslationKeys.COIN_FLIP_RESULT, [
            runner.args!.localizer.get(
              selectedCoin as unknown as FurudeTranslationKeys
            ),
          ])
        )
      );
    };
  }
}
