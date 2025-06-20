import { Fighter } from "./Fighter";
import chalk from "chalk";
import { typeText } from "../utils/typeText";

export class CounterPuncher extends Fighter {
  counterIndex: number;

  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = 0,
    isBlocking: boolean = false,
    counterIndex: number,
    rageSuceptibility: boolean = false,
    vulnerabilityIndex: number = 0.8,
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
    this.counterIndex = counterIndex;
  }

  override async getStats(): Promise<void> {
    await typeText(
      chalk.bgGreen(
        `Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, stamina: ${this.stamina} *SPECIAL* CounterIndex: ${this.counterIndex}, speed: ${this.speed}\n`,
      ),
      1,
    );
  }

  override getFighterClass(): string {
    return "CounterPuncher";
  }

  override async receiveDamage(
    damage: number,
    oponent: Fighter,
  ): Promise<void> {
    if (this.isCurrentlyBlocking()) {
      await typeText(
        chalk.bgGreen(`${this.name} successfully blocked the attack!\n`),
      );
      return;
    } else if (await this.dodgeAttack()) {
      oponent.updateVulnerabilityIndex(0.05);
      oponent.updateStamina(-5);
      return;
    }

    if (this.stamina < 30) {
      await typeText(
        chalk.bgRed(`${this.name} completely receives the attack! \n`),
      );
      this.health -= damage * 1.2 * this.vulnerabilityIndex;
    } else {
      this.health -= damage * this.vulnerabilityIndex;
      await typeText(
        chalk.bgRed(
          `${this.name} has received ${(damage * this.vulnerabilityIndex).toFixed(2)} damage!\n`,
        ),
      );
    }

    if (
      Math.random() < this.counterIndex &&
      this.health > 0 &&
      this.stamina >= 20
    ) {
      await typeText(
        chalk.bgYellowBright.bold(
          `${this.name} has counter punched ${oponent.name}!\n`,
        ),
      );
      await oponent.receiveDamage(
        this.strength * 3 * this.vulnerabilityIndex,
        this,
      );
      this.counterIndex -= 0.1;
      this.stamina -= 10;
    }

    if (this.health <= 0) {
      this.health = 0;
      await typeText(chalk.bgGray(`${this.name} has been defeated!\n`));
      return;
    } else {
      await typeText(
        chalk.bgGreen(`${this.name}'s health is now ${this.health}\n`),
      );
    }
  }
}
