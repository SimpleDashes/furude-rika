import Localizer from '../modules/framework/localization/v1/Localizer';
import StringWithVariablesManager from '../modules/framework/localization/v1/StringWithVariablesManager';
import type IFurudeResource from './IFurudeResource';
import SupportedFurudeLocales from './SupportedFurudeLocales';
import { variablePrefix } from '../modules/framework/localization/v1/StringWithVariablesManager';
import type IVariableManagerGetter from '../modules/framework/localization/v1/IVariableManagerGetter';
import type FurudeResource from './FurudeResource';
import type FurudeTranslationKeys from './FurudeTranslationKeys';
import ResourceResolver from './ResourceResolver';
import DirectoryMapper from '../modules/framework/io/DirectoryMapper';
import path from 'path';
import type DefaultContext from '../client/contexts/DefaultContext';
import Strings from '../containers/Strings';
import { assertDefined } from '../modules/framework/types/TypeAssertions';

export default class FurudeLocales extends Localizer<IFurudeResource> {
  static #resourceResolver = new ResourceResolver(
    new DirectoryMapper(path.join(__dirname, 'resources'))
  );

  static #defaultLocale = SupportedFurudeLocales.english;

  static #translations: FurudeResource[] = [];

  static #variablesManager = new StringWithVariablesManager();

  static #built = false;

  #context?: DefaultContext<unknown>;

  #language: SupportedFurudeLocales;

  public get Language(): SupportedFurudeLocales {
    return this.#language;
  }

  public set Language(value: SupportedFurudeLocales | undefined | null) {
    this.#language = value
      ? value
      : this.#context
      ? this.#context.dbGuild?.preferred_locale ??
        this.#context.dbChannel?.preferred_locale ??
        this.#context.dbGuild?.preferred_locale ??
        this.#context.dbUser.preferred_locale ??
        FurudeLocales.#defaultLocale
      : FurudeLocales.#defaultLocale;
  }

  public constructor(options?: {
    language?: SupportedFurudeLocales;
    context?: DefaultContext<unknown>;
  }) {
    super({
      defaultLocale: FurudeLocales.#defaultLocale,
      locales: FurudeLocales.#translations,
    });
    this.#context = options?.context;
    this.#language = FurudeLocales.#defaultLocale;
    this.Language = options?.language;
  }

  public async build(): Promise<void> {
    if (!FurudeLocales.#built) {
      FurudeLocales.#translations.push(
        ...(await FurudeLocales.#resourceResolver.getAllObjects()).map(
          (r) => r.object
        )
      );
      for (const value of FurudeLocales.#translations) {
        for (const key in value.structure) {
          const template = (
            value.structure as unknown as Record<string, string>
          )[key];
          if (template && template.includes(variablePrefix)) {
            FurudeLocales.#variablesManager.addString(
              template,
              this.#getKey(SupportedFurudeLocales[value.furudeLocale], key)
            );
          }
        }
      }
    }
    FurudeLocales.#built = true;
    await this.onReady();
  }

  #getKey(locale: SupportedFurudeLocales, key: string): string {
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
    const find = FurudeLocales.#translations.find((translation) => {
      return translation.locale === this.Language;
    })?.structure[key];
    if (!find) return Strings.EMPTY;
    if (values.args) {
      values.key = this.#getKey(this.Language, values.key);
      values.args = values.args ?? [];
      if (FurudeLocales.#variablesManager.stringsWithVariables[values.key]) {
        const replacedPlaceHolders =
          FurudeLocales.#variablesManager.getString(values);

        assertDefined(replacedPlaceHolders);

        return replacedPlaceHolders;
      }
    }
    return find;
  }
}
