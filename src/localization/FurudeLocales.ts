import Localizer from '../modules/framework/localization/Localizer';
import StringWithVariablesManager from '../modules/framework/localization/StringWithVariablesManager';
import IFurudeResource from './IFurudeResource';
import SupportedFurudeLocales from './SupportedFurudeLocales';
import { variablePrefix } from '../modules/framework/localization/StringWithVariablesManager';
import IVariableManagerGetter from '../modules/framework/localization/IVariableManagerGetter';
import FurudeResource from './FurudeResource';
import FurudeTranslationKeys from './FurudeTranslationKeys';
import ResourceResolver from './ResourceResolver';
import DirectoryMapper from '../modules/framework/io/DirectoryMapper';
import path from 'path';
import DefaultContext from '../client/contexts/DefaultContext';
import Strings from '../containers/Strings';
import { assertDefined } from '../modules/framework/types/TypeAssertions';

const resourceResolver = new ResourceResolver(
  new DirectoryMapper(path.join(__dirname, 'resources'))
);

const defaultFurudeLocale = SupportedFurudeLocales.english;

const translations: FurudeResource[] = [];
const stringWithVariablesManager = new StringWithVariablesManager();

let builtGlobals = false;

export default class FurudeLocales extends Localizer<IFurudeResource> {
  private readonly context?: DefaultContext;
  public language: SupportedFurudeLocales;

  public constructor(options?: {
    language?: SupportedFurudeLocales;
    context?: DefaultContext;
  }) {
    super({
      defaultLocale: defaultFurudeLocale,
      locales: translations,
    });
    this.context = options?.context;
    this.language = options?.language ?? defaultFurudeLocale;
  }

  public async build(): Promise<void> {
    if (!builtGlobals) {
      translations.push(
        ...(await resourceResolver.getAllObjects()).map((r) => r.object)
      );
      for (const value of translations) {
        for (const key in value.structure) {
          const template = (
            value.structure as unknown as Record<string, string>
          )[key];
          if (template && template.includes(variablePrefix)) {
            stringWithVariablesManager.addString(
              template,
              this.getKey(SupportedFurudeLocales[value.furudeLocale], key)
            );
          }
        }
      }
    }
    builtGlobals = true;
    await this.onReady();
  }

  private getKey(locale: SupportedFurudeLocales, key: string): string {
    return `${locale}-${key}`;
  }

  /**
   *
   * @param key localized key to get a localized string
   * @param options lng: selected language, values: used for replace placeholder string values
   * @returns a localized string
   */
  public get(key: FurudeTranslationKeys, vars?: string[]): string {
    const values: IVariableManagerGetter = {
      key,
      args: vars ?? [],
    };
    if (this.context) {
      this.language =
        this.context.dbChannel?.preferred_locale ??
        this.context.dbGuild?.preferred_locale ??
        this.context.dbUser.preferred_locale ??
        this.language;
    }
    const find = translations.find((translation) => {
      return translation.locale === this.language;
    })?.structure[key];
    if (!find) return Strings.EMPTY;
    if (values.args) {
      values.key = this.getKey(this.language, values.key);
      values.args = values.args ?? [];
      if (stringWithVariablesManager.stringsWithVariables[values.key]) {
        const replacedPlaceHolders =
          stringWithVariablesManager.getString(values);

        assertDefined(replacedPlaceHolders);

        return replacedPlaceHolders;
      }
    }
    return find;
  }
}
