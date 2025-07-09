import { Fighter } from "../classes/Fighter";

type FighterStyle = "Puncher" | "CounterPuncher" | "OutBoxer";

export class MixtFighter extends Fighter {
  private switchStance: boolean;
  private FighterStyle: FighterStyle;

  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = 0,
    isBlocking: boolean = false,
    rageSuceptibility: boolean = false,
    vulnerabilityIndex: number = 1.1,
    logger: (msg: string) => Promise<void>,
  ) {
    super(
      name,
      health,
      strength,
      speed,
      blockFail,
      isBlocking,
      rageSuceptibility,
      vulnerabilityIndex,
      logger,
    );
    this.switchStance = false;
    this.FighterStyle = "Puncher";
  }

  public getFighterSwitchStance(): boolean {
    return this.switchStance;
  }

  public changeFighterSwitchStance(switchStance: boolean): void {
    this.switchStance = switchStance;
  }

  public getFighterStyle(): FighterStyle {
    return this.FighterStyle;
  }
}
