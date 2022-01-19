import type DefaultContext from '../../contexts/DefaultContext';
import CommandOptions from '../../containers/CommandOptions';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import { assertDefined } from 'discowork/src/assertions';
import type { TypedArgs } from 'discowork/src/contexts/TypedArgs';
import BooleanOption from 'discowork/src/options/classes/BooleanOption';
import StringOption from 'discowork/src/options/classes/StringOption';
import {
  CommandPreconditions,
  Preconditions,
} from 'discowork/src/preconditions';
import { CommandInformation } from 'discowork/src/commands/decorators';

type Args = {
  commandName: StringOption;
  isDebug: BooleanOption;
};

@CommandPreconditions(Preconditions.OwnerOnly)
@CommandInformation({
  name: 'deploy',
  description: 'deploys a discord command',
})
export default class Deploy extends FurudeCommand<Args, DefaultContext<Args>> {
  public createArguments(): Args {
    return {
      commandName: new StringOption()
        .setRequired(true)
        .setName(CommandOptions.name)
        .setDescription('Name of the command to be deployed'),
      isDebug: new BooleanOption()
        .setName(CommandOptions.debug)
        .setDescription(
          'Deploys the command only in development server if true.'
        ),
    };
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
    const { args, client } = context;

    const { commandName } = args;

    assertDefined(commandName);

    /**
     * TODO debug handling.
     * TODO output.
     */

    await client.Deployer.deployCommand({
      commandName,
      context,
    });

    /**+
     * {
        onCommandNotFound: async () => {
          await InteractionUtils.reply(
            interaction,
            MessageCreator.fail(
              localizer.getTranslationFromContext(
                context,
                (k) => k.deploy.command.missing,
                {}
              )
            )
          );
        },
        onInvalidCommand: async () => {
          await InteractionUtils.reply(
            interaction,
            MessageCreator.fail(
              localizer.getTranslationFromContext(
                context,
                (k) => k.deploy.command.corrupted,
                {}
              )
            )
          );
        },
        onError: async () => {
          await InteractionUtils.reply(
            interaction,
            MessageCreator.fail(
              localizer.getTranslationFromContext(
                context,
                (k) => k.deploy.command.error,
                {}
              )
            )
          );
        },
        onSuccess: async () => {
          await InteractionUtils.reply(
            interaction,
            MessageCreator.success(
              localizer.getTranslationFromContext(
                context,
                (k) => k.deploy.command.success,
                {}
              )
            )
          );
        },
      },
     */
  }
}
