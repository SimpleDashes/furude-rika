import FurudeRika from '../../client/FurudeRika';
import DefaultContext from '../../client/contexts/DefaultContext';
import ICommandContext from '../../modules/framework/commands/interfaces/ICommandContext';

export default class FurudeCommandWrapper {
  // TODO PROPER IMPLEMENTATION OF DOWN THING
  /** 
  public static async createRunner(
    context: DefaultContext
  ): Promise<IFurudeRunner<unknown>> {
    await context.interaction.deferReply();

    context.dbUser!.incrementExperience(
      context.interaction.user,
      context.interaction.inGuild() &&
        context.interaction.channel instanceof GuildChannel
        ? {
            rawGuild: context.interaction.guild!,
            dbGuild: context.dbGuild!,
            channel: context.interaction.channel!,
          }
        : undefined
    );

    return context;
  }

  */

  public static defaultContext(
    baseContext: ICommandContext<FurudeRika>
  ): DefaultContext {
    return new DefaultContext(baseContext);
  }
}
