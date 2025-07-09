import { Fighter } from "./Fighter";
import { Logger } from "../common/Logger";

export class Puncher extends Fighter {
  damageMultiplicator: number;

  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = 0,
    isBlocking: boolean = false,
    damageMultiplicator: number,
    rageSuceptibility: boolean = false,
    vulnerabilityIndex: number = 0.8,
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
    this.damageMultiplicator = damageMultiplicator;
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
      this.getLogger(),
    );
  }
}
