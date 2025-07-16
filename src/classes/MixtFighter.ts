import { Fighter } from "../classes/Fighter";
import { Logger } from "../common/Logger";
import { defaultValues } from "../common/defaultValues";

type FighterStyle = "Puncher" | "CounterPuncher" | "OutBoxer";

export class MixtFighter extends Fighter {
  private switchStance: boolean;
  private FighterStyle: FighterStyle;

  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = defaultValues.common.blockFail,
    isBlocking: boolean = defaultValues.common.isBlocking,
    rageSuceptibility: boolean = defaultValues.common.rageSuceptibility,
    vulnerabilityIndex: number = defaultValues.mixtFighter.vulnerabilityIndex,
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
