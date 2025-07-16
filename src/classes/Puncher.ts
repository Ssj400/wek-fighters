import { Fighter } from "./Fighter";
import { Logger } from "../common/Logger";
import { defaultValues } from "../common/defaultValues";

export class Puncher extends Fighter {
  damageMultiplicator: number;

  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = defaultValues.common.blockFail,
    isBlocking: boolean = defaultValues.common.isBlocking,
    damageMultiplicator: number,
    rageSuceptibility: boolean = defaultValues.common.rageSuceptibility,
    vulnerabilityIndex: number = defaultValues.puncher.vulnerabilityIndex,
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
