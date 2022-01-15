import { assertDefined } from '../framework/types/TypeAssertions';

class ValueChangeEvent<T> {
  public readonly oldValue: T;
  public readonly newValue: T;

  public constructor(oldValue: T, newValue: T) {
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
}

interface IValueChangeListener<T> {
  onValueChange: (event: ValueChangeEvent<T>) => void;
}

export default class BindableValue<T> implements IValueChangeListener<T> {
  #current!: T;

  public get Current(): T {
    return this.#current;
  }

  public set Current(value: T) {
    const ruledNewCurrent = this.applyValueChangeRules(value);
    const changeEvent = new ValueChangeEvent(this.#current, ruledNewCurrent);

    /**
     * We fire it before actually assigning it because of some nuances on how "set" actually works.
     * Otherwise "triggerValueChange" will raise some really unexpected behaviors
     */
    this.triggerValueChange(this, changeEvent);

    this.#current = ruledNewCurrent;
  }

  #default!: T;

  public get Default(): T {
    return this.#default;
  }

  public set Default(value: T) {
    this.#default = this.applyValueChangeRules(value);
  }

  public constructor(value?: T, defaultValue: T | undefined = value) {
    const appliedCurrentValue: T | null = value ?? this.defaultCurrentValue();

    if (appliedCurrentValue === null) {
      throw "The built bindable doesn't appear to have a default defaultValue and you didn't supply a value to it.";
    }

    this.Current = appliedCurrentValue;
    this.Default = defaultValue ? defaultValue : appliedCurrentValue;
  }

  public applyValueChangeRules(value: T): T {
    return value;
  }

  public changeToDefaultValue(): void {
    this.Current = this.#default;
  }

  protected onValueChangeListeners: IValueChangeListener<T>[] = [];

  public addValueChangeListener(listener: IValueChangeListener<T>): void {
    this.onValueChangeListeners.push(listener);
  }

  public removeValueChangeListener(listener: IValueChangeListener<T>): void {
    this.onValueChangeListeners.filter((o) => o != listener);
  }

  public triggerValueChange(source: this, event: ValueChangeEvent<T>): void {
    if (event.oldValue != event.newValue) {
      for (const listener of this.onValueChangeListeners) {
        if (listener === source) continue;
        listener.onValueChange(event);
      }
    }
  }

  public onValueChange(event: ValueChangeEvent<T>): void {
    assertDefined(event);
  }

  public defaultCurrentValue(): T | null {
    return null;
  }
}
