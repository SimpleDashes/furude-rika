import Localizer from '../framework/localization/Localizer';
import StringWithVariablesManager from '../framework/localization/StringWithVariablesManager';
import IFurudeResource from './IFurudeResource';
import SupportedFurudeLocales from './SupportedFurudeLocales';
import { variablePrefix } from '../framework/localization/StringWithVariablesManager';
import IVariableManagerGetter from '../framework/localization/IVariableManagerGetter';
import FurudeResource from './FurudeResource';
import FurudeTranslationKeys from './FurudeTranslationKeys';
import ResourceResolver from './ResourceResolver';
import DirectoryMapper from '../framework/io/DirectoryMapper';
import path from 'path';
import { CommandInteraction } from 'discord.js';
import { FurudeUser } from '../database/entity/FurudeUser';
import FurudeRika from '../client/FurudeRika';

const resourceResolver = new ResourceResolver(
  new DirectoryMapper(path.join(__dirname, 'resources'))
);

const defaultFurudeLocale = SupportedFurudeLocales.pt_br;

const translations: FurudeResource[] = [];

export default class FurudeLocales extends Localizer<IFurudeResource> {
  private readonly client: FurudeRika;
  public readonly stringWithVariablesManager = new StringWithVariablesManager();

  public constructor(client: FurudeRika) {
    super({
      defaultLocale: defaultFurudeLocale,
      locales: translations,
    });
    this.client = client;
  }

  public async build() {
    translations.push(
      ...(await resourceResolver.getAllObjects()).map((r) => r.object)
    );
    for (const value of translations) {
      for (const key in value.structure) {
        const template = (value.structure as unknown as Record<string, string>)[
          key
        ];
        if (template && template.includes(variablePrefix)) {
          this.stringWithVariablesManager.addString(
            template,
            this.getKey(SupportedFurudeLocales[value.furudeLocale], key)
          );
        }
      }
    }
    this.onReady();
  }

  private getKey(locale: SupportedFurudeLocales, key: string) {
    return `${locale}-${key}`;
  }

  /**
   *
   * @param key localized key to get a localized string
   * @param options lng: selected language, values: used for replace placeholder string values
   * @returns a localized string
   */
  public async get(
    key: FurudeTranslationKeys,
    options: {
      discord: {
        interaction: CommandInteraction;
        furudeUser?: FurudeUser;
      };
      lng?: SupportedFurudeLocales;
      values?: Partial<IVariableManagerGetter>;
    }
  ) {
    if (!options.discord.furudeUser) {
      options.discord.furudeUser = await this.client.db.getFurudeUser(
        options.discord.interaction.user
      );
    }

    const lng =
      options?.lng ??
      options?.discord?.furudeUser?.preferred_locale ??
      defaultFurudeLocale;

    const find = translations.find((translation) => {
      return translation.locale == lng;
    })?.structure[key];
    if (!find) return '';
    if (options?.values) {
      options.values.key = this.getKey(lng, options.values.key ?? key);
      options.values.args = options.values.args ?? [];
      if (
        this.stringWithVariablesManager.stringsWithVariables[options.values.key]
      ) {
        return (
          this.stringWithVariablesManager.getString(
            options.values as IVariableManagerGetter
          ) ?? ''
        );
      }
    }
    return find;
  }
}
