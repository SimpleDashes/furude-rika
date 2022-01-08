import {
  MessageComponentInteraction,
  CacheType,
  CommandInteraction,
  MessageButton,
} from 'discord.js';
import {
  IListenerButton,
  MessageButtonCreator,
} from '../../../modules/framework/creators/MessageButtonCreator';
import MessageButtonFactory from '../../../modules/framework/creators/MessageButtonFactory';
import BaseEmbed from '../../../modules/framework/embeds/BaseEmbed';
import InteractionUtils from '../../../modules/framework/interactions/InteractionUtils';

type ButtonCustomizer = (button: MessageButton) => void;
type ExpandingChangeListener = (button: MessageButton) => Promise<void>;

export default class ExpandableEmbedHelper {
  static createExpandButton(
    buttonFactory: MessageButtonFactory
  ): MessageButton {
    return buttonFactory.newButton().setStyle('SUCCESS').setLabel('Expand');
  }

  static createMinimizeButton(
    buttonFactory: MessageButtonFactory
  ): MessageButton {
    return buttonFactory.newButton().setStyle('SUCCESS').setLabel('Minimize');
  }

  static async createExpandingInteractiveButton(
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
  ) {
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

  static async createMinimizingInteractiveButton(
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
  ) {
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

  static async createInteractiveButtons(
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
  ) {
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
            listener.onExpand(expandButton);
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
            listener.onMinimize(minimizeButton);
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
