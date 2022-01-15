import { secondsToMilliseconds } from 'date-fns';
import type {
  ButtonInteraction,
  CacheType,
  Collection,
  CommandInteraction,
  InteractionCollector,
  InteractionReplyOptions,
  Message,
  MessageComponentInteraction,
  MessageEmbed,
  Snowflake,
} from 'discord.js';
import { MessageActionRow, MessageButton } from 'discord.js';
import Strings from '../../../containers/Strings';
import MessageCreator from '../helpers/MessageCreator';
import StringHelper from '../helpers/StringHelper';
import InteractionUtils from '../interactions/InteractionUtils';
import type PageOption from '../options/custom/PageOption';
import InteractionCollectorCreator from './abstracts/InteractionCollectorCreator';
import type OnButtonPageChange from './interfaces/OnButtonPageChange';
import Symbols from './Symbols';
import { capitalize } from '@stdlib/string';
import { assertDefined } from '../types/TypeAssertions';

type Column = {
  name: string;
  padding?: number;
};

enum PaginationIDS {
  back = 'back',
  next = 'next',
  backward = 'backward',
  forward = 'forward',
}

enum ConfirmationIDS {
  yes = 'yes',
  no = 'no',
}

export interface IListenerButton {
  button: MessageButton;
  onPress: (interaction: ButtonInteraction) => Promise<void>;
}

/**
 * A utility to create message buttons.
 */
export abstract class MessageButtonCreator extends InteractionCollectorCreator {
  /**
   * Creates a button-based paging with limited page.
   *
   * If there is only 1 page to view, no buttons will be enabled.
   *
   * @param interaction The interaction that triggered the button-based paging.
   * @param options Options to be used when sending the button-based paging message.
   * @param users The IDs of users who can interact with the buttons.
   * @param contents The contents to be used in the button-based paging.
   * @param contentsPerPage The amount of contents to be displayed in one page.
   * @param startPage The page to start the paging from.
   * @param duration The duration the button-based paging will be active, in seconds.
   * @param onPageChange The function to be executed when the page is changed.
   * @param onPageChangeArgs Arguments for `onPageChange` function.
   * @returns The collector that collects the button-pressing event.
   */
  public static async createLimitedButtonBasedPaging<T>(
    interaction: CommandInteraction | MessageComponentInteraction,
    options: InteractionReplyOptions,
    users: Snowflake[],
    contents: T[],
    contentsPerPage: number,
    startPage: number,
    duration: number,
    onPageChange: OnButtonPageChange<T>,
    ...onPageChangeArgs: unknown[]
  ): Promise<Message> {
    return await this.#createButtonBasedPaging(
      interaction,
      options,
      users,
      contents,
      contentsPerPage,
      startPage,
      duration,
      false,
      onPageChange,
      ...onPageChangeArgs
    );
  }

  /**
   * Creates a button-based paging with limitless page.
   *
   * @param interaction The interaction that triggered the button-based paging.
   * @param options Options to be used when sending the button-based paging message.
   * @param users The IDs of users who can interact with the buttons.
   * @param contents The contents to be used in the button-based paging.
   * @param startPage The page to start the paging from.
   * @param duration The duration the button-based paging will be active, in seconds.
   * @param onPageChange The function to be executed when the page is changed.
   * @param onPageChangeArgs Arguments for `onPageChange` function.
   * @returns The collector that collects the button-pressing event.
   */
  public static async createLimitlessButtonBasedPaging<T>(
    interaction: CommandInteraction | MessageComponentInteraction,
    options: InteractionReplyOptions,
    users: Snowflake[],
    contents: T[],
    startPage: number,
    duration: number,
    onPageChange: OnButtonPageChange<T>,
    ...onPageChangeArgs: unknown[]
  ): Promise<Message> {
    return await this.#createButtonBasedPaging(
      interaction,
      options,
      users,
      contents,
      Number.POSITIVE_INFINITY,
      startPage,
      duration,
      true,
      onPageChange,
      ...onPageChangeArgs
    );
  }

  public static async createBaseButtonCollectors(
    buttonListeners: IListenerButton[],
    interaction: CommandInteraction | MessageComponentInteraction,
    options: InteractionReplyOptions,
    users: Snowflake[],
    duration: number,
    runOnce?: boolean,
    onTimeOut?: () => Promise<void>
  ): Promise<Collection<string, ButtonInteraction<CacheType>>> {
    const component: MessageActionRow = new MessageActionRow().addComponents(
      buttonListeners.map((v) => v.button)
    );

    options.components ??= [];
    options.components.push(component);

    const reply = async (): Promise<Message> => {
      return (await InteractionUtils.reply(interaction, {
        ...options,
        ...{ fetchReply: true },
      })) as Message;
    };

    const removeButtons = async (): Promise<void> => {
      options.components =
        options.components?.filter((c) => c != component) ?? [];
      await reply();
    };

    const message: Message = await reply();

    const collector: InteractionCollector<ButtonInteraction> =
      this.createButtonCollector(message, users, duration);

    const replyToEvents = async (
      buttonInteraction: ButtonInteraction
    ): Promise<void> => {
      const pressedButton = buttonListeners.find(
        (l) => l.button.customId == buttonInteraction.customId
      );
      await pressedButton?.onPress(buttonInteraction);
    };

    collector.on('collect', async (buttonInteraction) => {
      if (runOnce) {
        collector.stop();
        await removeButtons();
      } else {
        await replyToEvents(buttonInteraction);
      }
    });

    return new Promise((resolve) => {
      collector.on('end', async (collected) => {
        const pressed: ButtonInteraction | undefined = collected.first();
        if (pressed) {
          await replyToEvents(pressed);
        } else if (onTimeOut) {
          await onTimeOut();
        }
        resolve(collected);
      });
    });
  }

  /**
   * Creates a confirmation interaction using buttons.
   *
   * @param interaction The interaction that triggered the confirmation buttons.
   * @param options Options of the confirmation message.
   * @param users The users who can perform confirmation.
   * @param duration The duration the confirmation button collector will remain active, in seconds.
   * @returns A boolean determining whether the user confirmed.
   */
  public static async createConfirmation(
    interaction: CommandInteraction | MessageComponentInteraction,
    options: InteractionReplyOptions,
    users: Snowflake[],
    duration: number,
    collectTime = 5
  ): Promise<boolean> {
    const buttons: MessageButton[] = this.#createConfirmationButtons();

    const cancel = async (
      interaction:
        | ButtonInteraction<CacheType>
        | MessageComponentInteraction<CacheType>
        | CommandInteraction<CacheType>,
      text: string
    ): Promise<void> => {
      await InteractionUtils.reply(interaction, {
        content: MessageCreator.error(text),
        components: [],
      });
      setTimeout(async () => {
        await interaction.deleteReply();
      }, secondsToMilliseconds(collectTime));
    };

    const confirmationButton = buttons.find(
      (b) => b.customId == ConfirmationIDS.yes
    );

    assertDefined(confirmationButton);

    const negationButton = buttons.find(
      (b) => b.customId == ConfirmationIDS.no
    );

    assertDefined(negationButton);

    const collected = await this.createBaseButtonCollectors(
      [
        {
          button: confirmationButton,
          onPress: async (): Promise<void> => {
            await InteractionUtils.reply(interaction, {
              content: MessageCreator.error(`Please wait... ${Symbols.timer}`),
              components: [],
            });
          },
        },
        {
          button: negationButton,
          onPress: async (i): Promise<void> => {
            await cancel(i, 'Action cancelled.');
          },
        },
      ],
      interaction,
      options,
      users,
      duration,
      true,
      async () => {
        await cancel(interaction, 'Timed out.');
      }
    );

    return collected.first()?.customId === ConfirmationIDS.yes;
  }

  /**
   * Creates a button-based paging.
   *
   * If there is only 1 page to view, no buttons will be shown.
   *
   * @param interaction The interaction that triggered the button-based paging.
   * @param options Options to be used when sending the button-based paging message.
   * @param users The IDs of users who can interact with the buttons.
   * @param contents The contents to be used in the button-based paging.
   * @param contentsPerPage The amount of contents to be displayed in one page.
   * @param startPage The page to start the paging from.
   * @param duration The duration the button-based paging will be active, in seconds.
   * @param limitless Whether the button-based paging has no end page.
   * @param onPageChange The function to be executed when the page is changed.
   * @param onPageChangeArgs Arguments for `onPageChange` function.
   * @returns The collector that collects the button-pressing event.
   */
  static async #createButtonBasedPaging<T>(
    interaction: CommandInteraction | MessageComponentInteraction,
    options: InteractionReplyOptions,
    users: Snowflake[],
    contents: T[],
    contentsPerPage: number,
    startPage: number,
    duration: number,
    limitless: boolean,
    onPageChange: OnButtonPageChange<T>,
    ...onPageChangeArgs: unknown[]
  ): Promise<Message> {
    const pages: number = limitless
      ? Number.POSITIVE_INFINITY
      : Math.ceil(contents.length / contentsPerPage);

    let currentPage: number = startPage;

    const buttons: MessageButton[] = this.#createPagingButtons(
      currentPage,
      pages
    );

    const component: MessageActionRow = new MessageActionRow().addComponents(
      buttons
    );

    if (pages !== 1) {
      options.components ??= [];
      options.components.push(component);
    }

    /**
     * Edits paging embed if the page button uses an embed to display contents to the user.
     */
    function onPageChangeEmbedEdit(): void {
      if (options.embeds) {
        for (let i = 0; i < options.embeds.length; ++i) {
          const embed: MessageEmbed = options.embeds[i] as MessageEmbed;
          embed.spliceFields(0, embed.fields.length);
          options.embeds[i] = embed;
        }
      }
    }

    await onPageChange(options, startPage, contents, ...onPageChangeArgs);

    const message: Message = (await InteractionUtils.reply(
      interaction,
      options
    )) as Message;

    if (pages === 1) {
      return message;
    }

    const collector: InteractionCollector<ButtonInteraction> =
      this.createButtonCollector(message, users, duration);

    collector.on('collect', async (i) => {
      await i.deferUpdate();

      switch (i.customId) {
        case PaginationIDS.backward:
          currentPage = Math.max(1, currentPage - 10);
          break;
        case PaginationIDS.back:
          if (currentPage === 1) {
            currentPage = pages;
          } else {
            --currentPage;
          }
          break;
        case PaginationIDS.next:
          if (currentPage === pages) {
            currentPage = 1;
          } else {
            ++currentPage;
          }
          break;
        case PaginationIDS.forward:
          currentPage = Math.min(currentPage + 10, pages);
          break;
        default:
          return;
      }

      component
        .spliceComponents(0, component.components.length)
        .addComponents(this.#createPagingButtons(currentPage, pages));

      onPageChangeEmbedEdit();

      await onPageChange(options, currentPage, contents, ...onPageChangeArgs);

      await i.editReply(options);
    });

    collector.on('end', async () => {
      component.components.forEach((component) => component.setDisabled(true));
      try {
        await InteractionUtils.reply(interaction, options);
      } catch {
        // Maybe timed out?.
      }
    });

    return message;
  }

  /**
   * Creates buttons used in paging.
   *
   * ID order: `[backward, back, none, next, forward]`
   *
   * @param currentPage The current page to be used for button label.
   * @param maxPage The maximum page possible to be used for button label.
   */
  static #createPagingButtons(
    currentPage: number,
    maxPage: number
  ): MessageButton[] {
    return [
      new MessageButton()
        .setCustomId(PaginationIDS.backward)
        .setEmoji(Symbols.skipBackward)
        .setStyle('PRIMARY')
        .setDisabled(currentPage === 1 || maxPage <= 5),
      new MessageButton()
        .setCustomId(PaginationIDS.back)
        .setEmoji(Symbols.leftArrow)
        .setStyle('SUCCESS')
        .setDisabled(maxPage === 1),
      new MessageButton()
        .setCustomId(Strings.UNKNOWN)
        .setLabel(
          Number.isFinite(maxPage)
            ? `${currentPage}/${maxPage}`
            : currentPage.toString()
        )
        .setStyle('SECONDARY')
        .setDisabled(true),
      new MessageButton()
        .setCustomId(PaginationIDS.next)
        .setEmoji(Symbols.rightArrow)
        .setStyle('SUCCESS')
        .setDisabled(maxPage === 1),
      new MessageButton()
        .setCustomId(PaginationIDS.forward)
        .setEmoji(Symbols.skipForward)
        .setStyle('PRIMARY')
        .setDisabled(currentPage === maxPage || maxPage <= 5),
    ];
  }

  /**
   * Creates buttons used in confirmation.
   *
   * ID order: `[yes, no]`
   */
  static #createConfirmationButtons(): MessageButton[] {
    return [
      new MessageButton()
        .setCustomId(ConfirmationIDS.yes)
        .setEmoji(Symbols.checkmark)
        .setLabel(capitalize(ConfirmationIDS.yes))
        .setStyle('SUCCESS'),
      new MessageButton()
        .setCustomId(ConfirmationIDS.no)
        .setEmoji(Symbols.cross)
        .setLabel(capitalize(ConfirmationIDS.no))
        .setStyle('DANGER'),
    ];
  }

  public static async createButtonBasedTable<T>(
    interaction: CommandInteraction,
    options: InteractionReplyOptions,
    users: Snowflake[],
    contents: T[],
    pageOption: PageOption,
    duration: number,
    tableColumns: Column[],
    fillTable: (item: T) => (string | undefined)[]
  ): Promise<Message<boolean>> {
    const internalColumns: Column[] = [{ name: '#', padding: 4 }];
    tableColumns = [...internalColumns, ...tableColumns];
    const filledTables: (string | undefined)[][] = [];
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      assertDefined(content);
      filledTables.push([(i + 1).toString(), ...fillTable(content)]);
    }
    return await this.createLimitedButtonBasedPaging(
      interaction,
      options,
      users,
      contents,
      pageOption.itemsPerPage,
      pageOption.apply(interaction, contents),
      duration,
      async (options, page) => {
        let output = Strings.EMPTY;

        const createColumnItem = (
          i: number,
          name: string | undefined
        ): void => {
          const column = tableColumns[i];

          if (!column) {
            throw 'Column should be indexed for createRow()';
          }

          const columnContents = filledTables.map((table) => table[i]);
          const longest = Math.max(
            StringHelper.getUnicodeStringLength(column.name),
            ...columnContents.map((v) => {
              assertDefined(v);
              return StringHelper.getUnicodeStringLength(v);
            })
          );

          output += ` | ${(name ?? ' - ').padEnd(
            Math.max(column.padding ?? 0, longest)
          )}`;
        };

        for (let i = 0; i < tableColumns.length; i++) {
          const column = tableColumns[i];
          assertDefined(column);
          createColumnItem(i, column.name);
        }

        output += '\n';
        await this.loopPages(
          pageOption.itemsPerPage,
          page,
          contents,
          async (i) => {
            const filledTable = filledTables[i];

            assertDefined(filledTable);

            for (let j = 0; j < tableColumns.length; j++) {
              const data = filledTable ? filledTable[j] : undefined;
              createColumnItem(j, data);
            }

            output += '\n';
            options.content = '```c\n' + output + '```';
          }
        );
      }
    );
  }

  public static getPageContentIndex(
    index: number,
    itemsPerPage: number,
    currentPage: number
  ): number {
    return (currentPage - 1) * itemsPerPage + index;
  }

  public static async loopPages(
    itemsPerPage: number,
    currentPage: number,
    items: unknown[],
    run: (i: number) => Promise<void>
  ): Promise<void> {
    for (
      let i = itemsPerPage * (currentPage - 1);
      i < itemsPerPage + itemsPerPage * (currentPage - 1);
      ++i
    ) {
      if (items[i]) await run(i);
    }
  }
}
