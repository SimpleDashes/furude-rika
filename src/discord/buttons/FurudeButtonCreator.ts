import { Snowflake } from 'discord-api-types';
import { CommandInteraction, InteractionReplyOptions } from 'discord.js';
import Strings from '../../containers/Strings';
import { MessageButtonCreator } from '../../modules/framework/creators/MessageButtonCreator';
import StringHelper from '../../modules/framework/helpers/StringHelper';
import PageOption from '../../modules/framework/options/custom/PageOption';

type Column = {
  name: string;
  padding?: number;
};

export default class FurudeButtonCreator {
  public static createButtonBasedTable<T>(
    interaction: CommandInteraction,
    options: InteractionReplyOptions,
    users: Snowflake[],
    contents: T[],
    pageOption: PageOption,
    duration: number,
    tableColumns: Column[],
    fillTable: (item: T) => (string | undefined)[]
  ) {
    const internalColumns: Column[] = [{ name: '#', padding: 4 }];
    tableColumns = [...internalColumns, ...tableColumns];
    const filledTables: (string | undefined)[][] = [];
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i]!;
      filledTables.push([(i + 1).toString(), ...fillTable(content)]);
    }
    return MessageButtonCreator.createLimitedButtonBasedPaging(
      interaction,
      options,
      users,
      contents,
      pageOption.itemsPerPage,
      pageOption.apply(interaction, contents),
      duration,
      async (options, page, _contents) => {
        let output = Strings.EMPTY;

        const createColumnItem = (i: number, name: string | undefined) => {
          const column = tableColumns[i];
          if (!column) {
            throw 'Column should be indexed for createRow()';
          }
          const columnContents = filledTables.map((table) => table[i]);
          const longest = Math.max(
            ...columnContents.map((v) =>
              StringHelper.getUnicodeStringLength(v!)
            )
          );

          output += ` | ${(name ?? ' - ').padEnd(
            Math.max(column.padding ?? 0, longest)
          )}`;
        };

        for (let i = 0; i < tableColumns.length; i++) {
          const column = tableColumns[i]!;
          createColumnItem(i, column.name);
        }

        output += '\n';

        for (
          let i = pageOption.itemsPerPage * (page - 1);
          i < pageOption.itemsPerPage + pageOption.itemsPerPage * (page - 1);
          ++i
        ) {
          const filledTable = filledTables[i]!;

          for (let j = 0; j < tableColumns.length; j++) {
            const data = filledTable ? filledTable[j] : undefined;
            createColumnItem(j, data);
          }

          output += '\n';
          options.content = '```c\n' + output + '```';
        }
      }
    );
  }
}
