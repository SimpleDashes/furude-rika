import consola from 'consola';
import { Collection } from 'discord.js';
import type ClassResolver from '../../io/ClassResolver';
import { assertDefinedGet } from '../../types/TypeAssertions';
import TypeUtils from '../../types/TypeUtils';
import type Locale from './Locale';
import type LocaleResource from './resources/LocaleResource';
import type ResourceValue from './resources/ResourceValue';

type VariableSettings = {
  prefix: string;
  suffix: string;
};
export default class Localizer<
  S extends Locale,
  T,
  R extends LocaleResource<S, T>
> {
  public readonly defaultLocale: S;

  readonly #resources: Collection<S, R> = new Collection();
  readonly #resourceResolver: ClassResolver<R>;
  #defaultResource!: R;
  #variableSettings: VariableSettings;

  public constructor(
    defaultLocale: S,
    resourceResolver: ClassResolver<R>,
    variableSettings: VariableSettings = {
      prefix: '{{',
      suffix: '}}',
    }
  ) {
    this.defaultLocale = defaultLocale;
    this.#resourceResolver = resourceResolver;
    this.#variableSettings = variableSettings;
  }

  /**
   * Builds the localizer instance, loads resources.
   */
  public async build(): Promise<void> {
    const response = await this.#resourceResolver.getAllObjects();
    const resources = response.map((r) => r.object);
    for (const resource of resources) {
      this.#resources.set(resource.locale, resource);
    }
    this.#defaultResource = assertDefinedGet(
      this.#resources.get(this.defaultLocale)
    );
  }

  /**
   *
   * @param locale The locale of the translation you want to get.
   * @param key A function that should return the ResourceValue you want from the resource structure of the locale.
   * @param placeholders The arguments to be passed to replace placeholders on the ResourceValue.
   * @param structure Do not modify used internally.
   * @param resourceValue Do not modify used internally.
   * @param typedArgs Do not modify used internally.
   * @returns A localized string.
   */
  public getTranslation<A extends string, K extends ResourceValue<A>>(
    locale: S,
    key: (structure: T) => K,
    placeholders?: typeof typedArgs & Record<string, string>,
    structure = ((): T => {
      let resource = this.#resources.get(locale);
      if (!resource) {
        consola.error(`Locale not found: ${locale}`);
        resource = this.#defaultResource;
      }
      return resource.structure;
    })(),
    resourceValue = key(structure),
    typedArgs = TypeUtils.strEnum<typeof resourceValue.args[number], string>(
      resourceValue.args
    )
  ): string {
    let { value } = resourceValue;
    const { args } = resourceValue;
    const recordPlaceHolders = placeholders as Record<string, string>;
    const argumentsCollection: Collection<A, string> = new Collection();

    for (const placeholder in recordPlaceHolders) {
      if (args.includes(placeholder as A)) {
        argumentsCollection.set(
          assertDefinedGet(args.find((a) => a === placeholder)),
          placeholder
        );
      } else {
        throw 'Invalid argument for translation get.';
      }
    }

    if ([...argumentsCollection.values()].length !== args.length) {
      throw 'Invalid number of arguments for translation get.';
    }

    const { prefix, suffix } = this.#variableSettings;
    for (const entry of argumentsCollection.entries()) {
      value = value.replaceAll(`${prefix}${entry[0]}${suffix}`, entry[1]);
    }

    return value;
  }
}
