import type DefaultContext from '../../client/contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import ArrayHelper from '../../modules/framework/helpers/ArrayHelper';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';

enum COIN {
  HEAD = FurudeTranslationKeys.COIN_FLIP_HEADS,
  TAILS = FurudeTranslationKeys.COIN_FLIP_TAILS,
}

export default class CoinFlip extends FurudeCommand<DefaultContext> {
  private readonly coinsArray = [COIN.HEAD, COIN.TAILS];

  public constructor() {
    super({
      name: 'coinflip',
      description: "Flips a coin, will it land on head or tails, let's see?",
    });
  }

  public async trigger(context: DefaultContext): Promise<void> {
    const { interaction, localizer } = context;

    const selectedCoin = ArrayHelper.getRandomArrayElement(this.coinsArray);
    await InteractionUtils.reply(
      interaction,
      MessageCreator.success(
        localizer.get(FurudeTranslationKeys.COIN_FLIP_RESULT, [
          localizer.get(selectedCoin as unknown as FurudeTranslationKeys),
        ])
      )
    );
  }
}
