import { Fighter } from "./Fighter";
import { Logger } from "../common/Logger";

export class OutBoxer extends Fighter {
  jabCount: number;
  distanceControlTurnsLeft: number;
  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = 0,
    isBlocking: boolean = false,
    rageSuceptibility: boolean = false,
    vulnerabilityIndex: number = 1.1,
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
    this.jabCount = 0;
    this.distanceControlTurnsLeft = 0;
  }
  override getFighterClass(): string {
    return "OutBoxer";
  }

  async checkDistanceControl(): Promise<boolean> {
    if (this.distanceControlTurnsLeft > 0) {
      this.distanceControlTurnsLeft--;
      await this.log(
        `${this.name} maintains distance control boost (${this.distanceControlTurnsLeft} turns left)\n`,
      );
      return true;
    }

    if (this.jabCount > 2 && this.stamina > 30 && this.health > 15) {
      this.distanceControlTurnsLeft = 2;
      this.jabCount = 0;
      await this.log(`${this.name} has measured the distance!`);
      await this.log(`${this.name} uses distance control!`);
      await this.log(
        `${this.name} maintains distance control boost (${this.distanceControlTurnsLeft} turns left)\n`,
      );

      return true;
    }
    await this.log(`${this.name} is measuring the distance...\n`);
    return false;
  }

  protected override createInstance(): Fighter {
    return new OutBoxer(
      this.name,
      this.health,
      this.strength,
      this.speed,
      this.blockFail,
      this.isBlocking,
      this.rageSuceptibility,
      this.vulnerabilityIndex,
      this.getLogger(),
    );
  }
}
