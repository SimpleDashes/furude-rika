import { InteractionUtils } from 'discowork';
import CommandInformation from 'discowork/lib/commands/decorators/CommandInformation';
import type DefaultContext from '../../contexts/DefaultContext';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import ArrayUtils from '../../utils/ArrayUtils';
import MessageCreator from '../../utils/MessageCreator';

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

    const selectedCoin = ArrayUtils.getRandomArrayElement(this.#coinsArray);
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
