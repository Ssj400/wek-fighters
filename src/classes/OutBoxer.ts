import { Fighter } from "./Fighter";
import { Logger } from "../common/Logger";
import { defaultValues } from "../common/defaultValues";

export class OutBoxer extends Fighter {
  jabCount: number;
  distanceControlTurnsLeft: number;
  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = defaultValues.common.blockFail,
    isBlocking: boolean = defaultValues.common.isBlocking,
    rageSuceptibility: boolean = defaultValues.common.rageSuceptibility,
    vulnerabilityIndex: number = defaultValues.outBoxer.vulnerabilityIndex,
    logger: Logger,
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
    this.jabCount = defaultValues.outBoxer.jabCount;
    this.distanceControlTurnsLeft =
      defaultValues.outBoxer.distanceControlTurnsLeft;
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
