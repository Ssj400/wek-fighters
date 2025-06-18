import chalk from 'chalk';
import { Fighter } from './Fighter';
import { typeText } from '../utils/typeText.js';

export class Puncher extends Fighter {
  damageMultiplicator: number;

  constructor(name: string, health: number, strength: number, speed: number, blockFail: number = 0, isBlocking: boolean = false, damageMultiplicator: number, rageSuceptibility: boolean = false) {
    super(name, health, strength, speed, blockFail, isBlocking, rageSuceptibility);
    this.damageMultiplicator = damageMultiplicator;
  }

  override async getStats(): Promise<void> {
    await typeText(chalk.bgGreen(`Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, stamina: ${this.stamina} *SPECIAL* Multiplicator: ${this.damageMultiplicator}, speed: ${this.speed}\n`), 1);
  }

   override getFighterClass(): string {
    return 'Puncher';
  }

}
