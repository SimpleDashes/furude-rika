import consola from 'consola';
import { Collection } from 'discord.js';
import type ClassResolver from '../io/ClassResolver';
import { assertDefinedGet } from '../types/TypeAssertions';
import type Locale from './Locale';
import type LocaleResource from './resources/LocaleResource';
import type ResourceValue from './resources/ResourceValue';

export type VariableSettings = {
  prefix: string;
  suffix: string;
};
export default abstract class Localizer<
  S extends Locale,
  T,
  R extends LocaleResource<S, T>
> {
  public static defaultVariableSettings: VariableSettings = {
    prefix: '{{',
    suffix: '}}',
  };

  public readonly defaultLocale: S;

  readonly #resources: Collection<S, R> = new Collection();
  readonly #resourceResolver: ClassResolver<R>;
  readonly #variableSettings: VariableSettings;
  #defaultResource!: R;

  public constructor(
    defaultLocale: S,
    resourceResolver: ClassResolver<R>,
    variableSettings: VariableSettings = Localizer.defaultVariableSettings
  ) {
    this.defaultLocale = defaultLocale;
    this.#resourceResolver = resourceResolver;
    this.#variableSettings = variableSettings;
  }

  public static getVariableNameForSetting(
    variable: string,
    settings: VariableSettings
  ): string {
    const { prefix, suffix } = settings;
    return `${prefix}${variable}${suffix}`;
  }

  /**
   * Builds the localizer instance, loads resources.
   */
  public async build(): Promise<void> {
    const response = await this.#resourceResolver.getAllObjects();
    const resources = response.map((r) => r.object);
    for (const resource of resources) {
      consola.log(`Setting resource with locale: ${resource.locale}`);
      this.#resources.set(resource.locale, resource);
    }
    consola.log(`Setting default resource with locale: ${this.defaultLocale}`);
    this.#defaultResource = assertDefinedGet(
      this.#resources.get(this.defaultLocale)
    );
  }

  /**
   *
   * @param locale The locale of the translation you want to get.
   * @param keyProvider A function that should return the ResourceValue you want from the resource structure of the locale.
   * @param placeholders The arguments to be passed to replace placeholders on the ResourceValue.
   * @param structure Do not modify used internally.
   * @param resourceValue Do not modify used internally.
   * @param typedArgs Do not modify used internally.
   * @returns A localized string.
   */
  public getTranslation<A extends string, K extends ResourceValue<A>>(
    locale: S | undefined,
    keyProvider: (key: T) => K,
    placeholders: { [K in A]: string }
  ): string {
    const recordPlaceHolders = placeholders as Record<string, string>;
    const argumentsCollection: Collection<string, string> = new Collection();

    let resource = this.#resources.get(locale ?? this.defaultLocale);
    if (!resource) {
      consola.error(`Locale not found: ${locale}`);
      resource = this.#defaultResource;
    }

    const structure = resource.structure;
    const resourceValue = keyProvider(structure);

    let { Value } = resourceValue;

    for (const placeholder in recordPlaceHolders) {
      argumentsCollection.set(
        placeholder,
        assertDefinedGet(recordPlaceHolders[placeholder])
      );
    }

    for (const entry of argumentsCollection.entries()) {
      Value = Value.replaceAll(
        Localizer.getVariableNameForSetting(entry[0], this.#variableSettings),
        entry[1]
      );
    }

    return Value;
  }
}
