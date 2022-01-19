import type DefaultContext from '../../contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import ArrayHelper from '../../modules/framework/helpers/ArrayHelper';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import { CommandInformation } from 'discowork/src/commands/decorators';
import InteractionUtils from 'discowork/src/utils/InteractionUtils';

enum COIN {
  HEAD,
  TAILS,
}

type Args = unknown;

@CommandInformation({
  name: 'coinflip',
  description: "Flips a coin, will it land on head or tails, let's see?",
})
export default class CoinFlip extends FurudeCommand<
  Args,
  DefaultContext<Args>
> {
  readonly #coinsArray = Object.values(COIN);

  public createArguments(): Args {
    return {};
  }

  public async trigger(context: DefaultContext<Args>): Promise<void> {
    const { interaction, client } = context;
    const { localizer } = client;

    const selectedCoin = ArrayHelper.getRandomArrayElement(this.#coinsArray);
    await InteractionUtils.reply(
      interaction,
      MessageCreator.success(
        localizer.getTranslationFromContext(context, (k) => k.coin.response, {
          SIDE: localizer.getTranslationFromContext(
            context,
            (k) => (selectedCoin === COIN.HEAD ? k.coin.heads : k.coin.tails),
            {}
          ),
        })
      )
    );
  }
}
