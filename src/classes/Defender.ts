import { Fighter } from "./Fighter";
import chalk from "chalk";
import { typeText } from "../utils/typeText";

export class Defender extends Fighter {
  defense: number;

  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = 0,
    isBlocking: boolean = false,
    defense: number,
    rageSuceptibility: boolean = false,
    vulnerabilityIndex: number = 0.65,
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
    this.defense = defense;
  }
  override async getStats(): Promise<void> {
    await typeText(
      chalk.bgGreen(
        `Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, stamina: ${this.stamina} *SPECIAL* defense: ${this.defense}, speed: ${this.speed}\n`,
      ),
      1,
    );
  }

  override getFighterClass(): string {
    return "Defender";
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
    }

    await typeText(chalk.bgRed(`${this.name} failed to block the attack!\n`));

    if (this.stamina < 30) {
      await typeText(
        chalk.bgRed(`${this.name} completely receives the attack! \n`),
      );
      this.health -= damage * 1.2 * this.vulnerabilityIndex + 0.3;
      await typeText(
        chalk.bgRed(
          `${this.name} has received ${(damage * 1.2 * this.vulnerabilityIndex + 0.3).toFixed(2)} damage!\n`,
        ),
      );
    } else {
      const reducedDamage = Math.max(0, damage - this.defense);
      this.defense = this.defense - 2;
      this.health -= reducedDamage * this.vulnerabilityIndex + 0.3;
      await typeText(
        chalk.bgMagenta(
          `${this.name} has received ${(reducedDamage * this.vulnerabilityIndex + 0.3).toFixed(2)} damage after defense!\n`,
        ),
      );
      await typeText(
        chalk.bgCyanBright(`${this.name}'s defense is now ${this.defense}\n`),
      );
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
