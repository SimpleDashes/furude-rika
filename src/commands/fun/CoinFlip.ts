import type DefaultContext from '../../client/contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import ArrayHelper from '../../modules/framework/helpers/ArrayHelper';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';
import type { TypedArgs } from '../../modules/framework/commands/contexts/types';

enum COIN {
  HEAD,
  TAILS,
}

type Args = unknown;

export default class CoinFlip extends FurudeCommand<
  DefaultContext<TypedArgs<Args>>,
  Args
> {
  readonly #coinsArray = Object.values(COIN);

  public createArgs(): Args {
    return {};
  }

  public constructor() {
    super({
      name: 'coinflip',
      description: "Flips a coin, will it land on head or tails, let's see?",
    });
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
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
