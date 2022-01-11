import BaseBot from '../../../client/BaseBot';
import InteractionUtils from '../../../interactions/InteractionUtils';
import ICommandContext from '../../interfaces/ICommandContext';

export default abstract class CommandPrecondition<
  CTX extends ICommandContext<BaseBot> = ICommandContext<BaseBot>
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

  protected abstract validateInternally(
    context: ICommandContext<any>
  ): Promise<boolean>;
}
