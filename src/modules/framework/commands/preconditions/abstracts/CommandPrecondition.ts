import InteractionUtils from '../../../interactions/InteractionUtils';
import type ICommandContext from '../../interfaces/ICommandContext';

export default abstract class CommandPrecondition<
  CTX extends ICommandContext = ICommandContext
> {
  public onFailMessage?: (context: CTX) => string;

  public async validate(context: CTX): Promise<boolean> {
    const { interaction } = context;

    const validated = await this.validateInternally(context);

    if (!validated && this.onFailMessage) {
      await InteractionUtils.reply(interaction, this.onFailMessage(context));
    }

    return validated;
  }

  protected abstract validateInternally(context: CTX): Promise<boolean>;
}
