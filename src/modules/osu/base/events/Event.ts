export type EventListener<T extends unknown[]> = (...args: T) => void;

export default class Event<T extends unknown[]> {
  private readonly listeners: EventListener<T>[] = [];

  public get Listeners(): EventListener<T>[] {
    return this.listeners;
  }

  public addListener(...listener: EventListener<T>[]): void {
    this.listeners.push(...listener);
  }

  public removeListener(...listener: EventListener<T>[]): void {
    listener
      .map((listener) => {
        const index = this.listeners.indexOf(listener);
        if (index === -1) {
          throw "Specified listener wasn't found on this event.";
        }
        return index;
      })
      .forEach((i) => this.listeners.splice(i, 1));
  }

  public invoke(...args: T): void {
    this.listeners.forEach((listener) => listener(...args));
  }
}
