import type {
  MessageComponentInteraction,
  CacheType,
  CommandInteraction,
  MessageButton,
} from 'discord.js';
import type {
  IListenerButton} from '../../../modules/framework/creators/MessageButtonCreator';
import {
  MessageButtonCreator,
} from '../../../modules/framework/creators/MessageButtonCreator';
import MessageButtonFactory from '../../../modules/framework/creators/MessageButtonFactory';
import type BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import InteractionUtils from '../../../modules/framework/interactions/InteractionUtils';

type ButtonCustomizer = (button: MessageButton) => void;
type ExpandingChangeListener = (button: MessageButton) => Promise<void>;

export default class ExpandableEmbedHelper {
  public static createExpandButton(
    buttonFactory: MessageButtonFactory
  ): MessageButton {
    return buttonFactory.newButton().setStyle('SUCCESS').setLabel('Expand');
  }

  public static createMinimizeButton(
    buttonFactory: MessageButtonFactory
  ): MessageButton {
    return buttonFactory.newButton().setStyle('SUCCESS').setLabel('Minimize');
  }

  public static async createExpandingInteractiveButton(
    minimizedEmbed: BaseEmbed,
    expandedEmbed: BaseEmbed,
    interaction:
      | MessageComponentInteraction<CacheType>
      | CommandInteraction<CacheType>,
    customize?: {
      expandButton?: ButtonCustomizer;
    },
    listener?: {
      onExpand?: ExpandingChangeListener;
    },
    ...otherEmbeds: BaseEmbed[]
  ): Promise<void> {
    return this.createInteractiveButtons(
      minimizedEmbed,
      expandedEmbed,
      interaction,
      minimizedEmbed,
      customize,
      {
        excludeMinimize: true,
        runOnce: true,
      },
      listener,
      ...otherEmbeds
    );
  }

  public static async createMinimizingInteractiveButton(
    minimizedEmbed: BaseEmbed,
    expandedEmbed: BaseEmbed,
    interaction:
      | MessageComponentInteraction<CacheType>
      | CommandInteraction<CacheType>,
    customize?: {
      minimizeButton?: ButtonCustomizer;
    },
    listener?: {
      onMinimize?: ExpandingChangeListener;
    },
    ...otherEmbeds: BaseEmbed[]
  ): Promise<void> {
    return this.createInteractiveButtons(
      minimizedEmbed,
      expandedEmbed,
      interaction,
      expandedEmbed,
      customize,
      {
        excludeExpand: true,
        runOnce: true,
      },
      listener,
      ...otherEmbeds
    );
  }

  public static async createInteractiveButtons(
    minimizedEmbed: BaseEmbed,
    expandedEmbed: BaseEmbed,
    interaction:
      | MessageComponentInteraction<CacheType>
      | CommandInteraction<CacheType>,
    defaultEmbed: BaseEmbed = minimizedEmbed,
    customize?: {
      all?: ButtonCustomizer;
      expandButton?: ButtonCustomizer;
      minimizeButton?: ButtonCustomizer;
    },
    options?: {
      runOnce?: boolean;
      excludeMinimize?: boolean;
      excludeExpand?: boolean;
    },
    listener?: {
      onExpand?: ExpandingChangeListener;
      onMinimize?: ExpandingChangeListener;
    },
    ...otherEmbeds: BaseEmbed[]
  ): Promise<void> {
    if (options?.excludeMinimize && options.excludeExpand) {
      throw "You shouldn't exclude all expanding buttons";
    }

    const buttonFactory = new MessageButtonFactory();

    const expandButton = this.createExpandButton(buttonFactory);
    const minimizeButton = this.createMinimizeButton(buttonFactory);

    if (customize) {
      if (customize.all) {
        for (const button of buttonFactory.createdButtons) {
          customize.all(button);
        }
      }
      if (!options?.excludeExpand && customize.expandButton) {
        customize.expandButton(expandButton);
      }
      if (!options?.excludeMinimize && customize.minimizeButton) {
        customize.minimizeButton(minimizeButton);
      }
    }

    const getEmbeds = (mainEmbed: BaseEmbed): BaseEmbed[] => {
      return [mainEmbed, ...otherEmbeds];
    };

    const listenerButtons: IListenerButton[] = [];

    if (!options?.excludeExpand) {
      listenerButtons.push({
        button: expandButton,
        onPress: async (i) => {
          if (listener?.onExpand) {
            await listener.onExpand(expandButton);
          }
          await InteractionUtils.safeUpdate(i, {
            embeds: getEmbeds(expandedEmbed),
          });
        },
      });
    }

    if (!options?.excludeMinimize) {
      listenerButtons.push({
        button: minimizeButton,
        onPress: async (i) => {
          if (listener?.onMinimize) {
            await listener.onMinimize(minimizeButton);
          }
          await InteractionUtils.safeUpdate(i, {
            embeds: getEmbeds(minimizedEmbed),
          });
        },
      });
    }

    await MessageButtonCreator.createBaseButtonCollectors(
      listenerButtons,
      interaction,
      { embeds: getEmbeds(defaultEmbed) },
      [interaction.user.id],
      60,
      options?.runOnce
    );
  }
}
