import type { EventListener } from '../events/Event';
import Event from '../events/Event';

export class ValueChangeEvent<T> {
  public readonly oldValue: T;
  public readonly newValue: T;

  public constructor(oldValue: T, newValue: T) {
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
}

export default class BindableValue<T> {
  /**
   *  An event which is raised when {@link Value} has changed (or manually via {@link triggerValueChange}).
   */
  public onValueChange = new Event<[ValueChangeEvent<T>]>();

  /**
   *  An event which is raised when {@link Default} has changed (or manually via {@link triggerDefaultChange}).
   */
  public onDefaultChange = new Event<[ValueChangeEvent<T>]>();

  /**
   *  An event which is raised when {@link Disabled} has changed (or manually via {@link triggerDisabledChange}).
   */
  public onDisabledChange = new Event<[boolean]>();

  #value!: T;

  public get Value(): T {
    return this.#value;
  }

  public set Value(value: T) {
    const newCurrent = this.applyValueChangeRules(value);
    const changeEvent = new ValueChangeEvent(this.#value, newCurrent);
    this.setValue(changeEvent);
  }

  private setValue(
    event: ValueChangeEvent<T>,
    bypassChecks = true,
    source: BindableValue<T> | null = null
  ): void {
    this.#value = event.newValue;
    this.triggerValueChange(source ?? this, event, true, bypassChecks);
  }

  #default!: T;

  public get Default(): T {
    return this.#default;
  }

  public set Default(value: T) {
    if (this.Default === value) return;
    const newDefault = this.applyValueChangeRules(value);
    const changeEvent = new ValueChangeEvent(this.#default, newDefault);
    this.setDefaultValue(changeEvent);
  }

  public isDefault(): boolean {
    return this.Value === this.Default;
  }

  private setDefaultValue(
    event: ValueChangeEvent<T>,
    bypassChecks = true,
    source: BindableValue<T> | null = null
  ): void {
    this.#default = event.newValue;
    this.triggerDefaultChange(source ?? this, event, true, bypassChecks);
  }

  #disabled = false;

  public get Disabled(): boolean {
    return this.Disabled;
  }

  public set Disabled(disabled: boolean) {
    if (this.#disabled === disabled) return;
    this.setDisabled(new ValueChangeEvent(this.#disabled, disabled));
  }

  private setDisabled(
    event: ValueChangeEvent<boolean>,
    bypassChecks = false,
    source: BindableValue<T> | null = null
  ): void {
    this.#disabled = event.newValue;
    this.triggerDisabledChange(source ?? this, bypassChecks);
  }

  protected bindings: BindableValue<T>[] = [];

  public constructor(value?: T) {
    const appliedCurrentValue: T | null = value ?? this.defaultCurrentValue();

    if (appliedCurrentValue === null) {
      throw "The built bindable doesn't appear to have a default defaultValue and you didn't supply a value to it.";
    }

    this.Value = this.Default = appliedCurrentValue;
  }

  public applyValueChangeRules(value: T): T {
    return value;
  }

  public changeToDefaultValue(): void {
    this.Value = this.#default;
  }

  public addValueChangeListener(
    ...listeners: EventListener<[ValueChangeEvent<T>]>[]
  ): void {
    this.onValueChange.addListener(...listeners);
  }

  public removeValueChangeListener(
    ...listeners: EventListener<[ValueChangeEvent<T>]>[]
  ): void {
    this.onValueChange.removeListener(...listeners);
  }

  public triggerChange(): void {
    this.triggerValueChange(
      this,
      new ValueChangeEvent(this.Value, this.Value),
      false
    );
    this.triggerDisabledChange(this, false);
  }

  #triggerInternalValueChange<U>(
    source: BindableValue<T>,
    event: ValueChangeEvent<U>,
    adjustValue: (bindable: BindableValue<T>) => void,
    triggerChange: () => void,
    getCurrentValue: () => U,
    propagateToBindings = true
  ): void {
    if (propagateToBindings) {
      this.bindings.forEach((b) => {
        if (b === source) return;
        adjustValue(b);
      });
    }

    if (event.oldValue !== getCurrentValue()) {
      triggerChange();
    }
  }

  public triggerValueChange(
    source: BindableValue<T>,
    event: ValueChangeEvent<T>,
    propagateToBindings = true,
    bypassChecks = false
  ): void {
    this.#triggerInternalValueChange(
      source,
      event,
      (b) => b.setValue(event, bypassChecks, this),
      () => this.onValueChange.invoke(event),
      () => this.Value,
      propagateToBindings
    );
  }

  public triggerDefaultChange(
    source: BindableValue<T>,
    event: ValueChangeEvent<T>,
    propagateToBindings = true,
    bypassChecks = false
  ): void {
    this.#triggerInternalValueChange(
      source,
      event,
      (b) => b.setDefaultValue(event, bypassChecks, source),
      () => this.onDefaultChange.invoke(event),
      () => this.Default,
      propagateToBindings
    );
  }

  public triggerDisabledChange(
    source: BindableValue<T>,
    propagateToBindings = true,
    bypassChecks = false
  ): void {
    const event = new ValueChangeEvent(this.Disabled, false);
    this.#triggerInternalValueChange(
      source,
      event,
      (b) => b.setDisabled(event, bypassChecks, source),
      () => this.onDisabledChange.invoke(event.newValue),
      () => this.Disabled,
      propagateToBindings
    );
  }

  public defaultCurrentValue(): T | null {
    return null;
  }

  /**
   * Binds this bindable to another such that bi-directional updates are propagated.
   * This will adopt any values and value limitations of the bindable bound to.
   * @param them The foreign bindable. This should always be the most permanent end of the bind (ie. a ConfigManager).
   */
  public bindTo(them: BindableValue<T>): void {
    if (this.bindings.includes(them)) {
      throw `This bindable is already bound to the requested bindable (${them}).`;
    }

    this.Value = them.Value;
    this.Default = them.Default;
    this.Disabled = them.Disabled;
    this.applyValueChangeRules = them.applyValueChangeRules;
  }

  #bindInternalValueChanged<U>(
    eventFirer: Event<[U]>,
    onChange: EventListener<[U]>,
    createChangeEvent: () => U,
    runOnceImmediately: boolean
  ): void {
    eventFirer.addListener(onChange);
    if (runOnceImmediately) {
      onChange(createChangeEvent());
    }
  }

  /**
   * Bind an action to {@link onValueChange} with the option of running the bound action once immediately.
   * @param onChange The action to perform when {@link Value} changes.
   * @param runOnceImmediately >Whether the action provided in {@link onChange} should be run once immediately.
   */
  public bindValueChanged(
    onChange: EventListener<[ValueChangeEvent<T>]>,
    runOnceImmediately = true
  ): void {
    this.#bindInternalValueChanged(
      this.onValueChange,
      onChange,
      () => new ValueChangeEvent(this.Value, this.Value),
      runOnceImmediately
    );
  }

  /**
   * Bind an action to {@link onDisabledChange} with the option of running the bound action once immediately.
   * @param onChange The action to perform when {@link Disabled} changes.
   * @param runOnceImmediately >Whether the action provided in {@link onChange} should be run once immediately.
   */
  public bindDisabledChanged(
    onChange: EventListener<[boolean]>,
    runOnceImmediately = true
  ): void {
    this.#bindInternalValueChanged(
      this.onDisabledChange,
      onChange,
      () => this.Disabled,
      runOnceImmediately
    );
  }

  /**
   * Unbinds any actions bound to the value changed events.
   */
  public unbindEvents(): void {
    this.onValueChange.Listeners.length =
      this.onDefaultChange.Listeners.length =
      this.onDisabledChange.Listeners.length =
        0;
  }

  /**
   * Remove all bound {@link binding}s via <see cref="GetBoundCopy"/> or {@link bindTo}.
   */
  public unbindBindings(): void {
    this.bindings.forEach((b) => this.unbindFrom(b));
  }

  public unbindFrom(binding: BindableValue<T>): void {
    this.bindings.splice(this.bindings.indexOf(binding), 1);
  }

  public unbindAll(): void {
    this.unbindEvents();
    this.unbindBindings();
  }

  /**
   * Create an unbound clone of this bindable.
   */
  public getUnboundCopy(): BindableValue<T> {
    const clone = this.getBoundCopy();
    clone.unbindAll();
    return clone;
  }

  /**
   * Create an bound clone of this bindable.
   */
  public getBoundCopy(): BindableValue<T> {
    const clone: BindableValue<T> = new this.constructor.prototype();
    clone.bindTo(this);
    return clone;
  }
}
