import type DefaultContext from '../../client/contexts/DefaultContext';
import CommandOptions from '../../containers/CommandOptions';
import FurudeCommand from '../../discord/commands/FurudeCommand';
import BooleanOption from '../../modules/framework/options/classes/BooleanOption';
import StringOption from '../../modules/framework/options/classes/StringOption';
import DeployHandler from '../../modules/framework/rest/DeployHandler';
import MessageCreator from '../../modules/framework/helpers/MessageCreator';
import FurudeTranslationKeys from '../../localization/FurudeTranslationKeys';
import InteractionUtils from '../../modules/framework/interactions/InteractionUtils';
import {
  Preconditions,
  SetPreconditions,
} from '../../modules/framework/preconditions/PreconditionDecorators';
import type { TypedArgs } from '../../modules/framework/commands/contexts/types';
import { assertDefined } from '../../modules/framework/types/TypeAssertions';

type Args = {
  commandName: StringOption;
  isDebug: BooleanOption;
};
@SetPreconditions(Preconditions.OwnerOnly)
export default class Deploy extends FurudeCommand<
  DefaultContext<TypedArgs<Args>>,
  Args
> {
  public createArgs(): Args {
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

  public constructor() {
    super({
      name: 'deploy',
      description: 'deploys a discord command',
    });
  }

  public async trigger(
    context: DefaultContext<TypedArgs<Args>>
  ): Promise<void> {
    const { interaction, client, localizer, args } = context;

    const { commandName } = args;
    let { isDebug } = args;

    assertDefined(commandName);
    isDebug = Boolean(isDebug);

    await DeployHandler.deployCommand<DefaultContext<TypedArgs<unknown>>>({
      client,
      commandName,
      isDebug,
      interaction,
      resFunctions: {
        onCommandNotFound: async () => {
          await InteractionUtils.reply(
            interaction,
            MessageCreator.fail(
              localizer.get(FurudeTranslationKeys.DEPLOY_COMMAND_NOT_FOUND)
            )
          );
        },
        onInvalidCommand: async () => {
          await InteractionUtils.reply(
            interaction,
            MessageCreator.fail(
              localizer.get(FurudeTranslationKeys.DEPLOY_COMMAND_CORRUPTED)
            )
          );
        },
        onError: async () => {
          await InteractionUtils.reply(
            interaction,
            MessageCreator.fail(
              localizer.get(FurudeTranslationKeys.DEPLOY_COMMAND_ERROR)
            )
          );
        },
        onSuccess: async () => {
          await InteractionUtils.reply(
            interaction,
            MessageCreator.success(
              localizer.get(FurudeTranslationKeys.DEPLOY_COMMAND_SUCCESS)
            )
          );
        },
      },
    });
  }
}
