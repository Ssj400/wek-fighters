import { Fighter } from "./Fighter";
import { Logger } from "../common/Logger";
import { defaultValues } from "../common/defaultValues";
import { GameManager } from "../managers/GameManager";

export class Puncher extends Fighter {
  logger: Logger;
  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = defaultValues.common.blockFail,
    isBlocking: boolean = defaultValues.common.isBlocking,
    private damageMultiplicator: number,
    rageSuceptibility: boolean = defaultValues.common.rageSuceptibility,
    vulnerabilityIndex: number = defaultValues.puncher.vulnerabilityIndex,
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
    );
    this.logger = GameManager.getInstance().createLogger(this.name);
  }

  override getStats(): string {
    return `Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, stamina: ${this.stamina} *SPECIAL* Multiplicator: ${this.damageMultiplicator}, speed: ${this.speed}`;
  }

  override getFighterClass(): string {
    return "Puncher";
  }

  protected override createInstance(): Fighter {
    return new Puncher(
      this.name,
      this.health,
      this.strength,
      this.speed,
      this.blockFail,
      this.isBlocking,
      this.damageMultiplicator,
      this.rageSuceptibility,
      this.vulnerabilityIndex,
    );
  }
}
