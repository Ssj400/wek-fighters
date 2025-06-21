import chalk from "chalk";
import { typeText } from "../utils/typeText";
import { Fighter } from "./Fighter";

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
    vulnerabilityIndex: number = 0.9,
    jabCount: number = 0,
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
    this.jabCount = 0;
    this.distanceControlTurnsLeft = 0;
  }
  override getFighterClass(): string {
    return "OutBoxer";
  }

  async checkDistanceControl(): Promise<boolean> {
    if (this.distanceControlTurnsLeft > 0) {
      this.distanceControlTurnsLeft--;
      await typeText(
        chalk.bgBlue(
          `${this.name} maintains distance control boost (${this.distanceControlTurnsLeft} turns left)\n`,
        ),
      );
      return true;
    }

    if (this.jabCount > 3 && this.stamina > 30 && this.health > 15) {
      await typeText(chalk.bgBlue(`${this.name} uses distance control!\n`));
      this.distanceControlTurnsLeft = 1;
      this.jabCount = 0;
      await typeText(
        chalk.bgBlue(
          `${this.name} maintains distance control boost (${this.distanceControlTurnsLeft} turns left)\n`,
        ),
      );
      return true;
    } else if (this.jabCount === 3 && this.stamina > 30 && this.health > 15) {
      await typeText(chalk.bgBlue(`${this.name} has measured the distance!\n`));
      return false;
    }
    await typeText(chalk.bgBlue(`${this.name} is measuring the distance...\n`));
    return false;
  }
}
