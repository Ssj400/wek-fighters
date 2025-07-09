import { Fighter } from "../classes/Fighter";
import { Logger } from "../common/Logger";

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
    vulnerabilityIndex: number = 0.9,
    logger?: Logger,
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
