export abstract class State {
  public enter(previous: string) { };
  public update() { };
  public exit(next: string) { };
}
