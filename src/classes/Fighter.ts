import chalk from "chalk";
import { typeText } from "../utils/typeText";
import { Attack } from "../common/attacks";
import { validateLife } from "../logic/validateLife";
export class Fighter {
  public readonly name: string;
  protected health: number;
  protected strength: number;
  protected speed: number;
  protected stamina: number;
  protected blockFail: number;
  protected isBlocking: boolean;
  protected rageSuceptibility: boolean;
  protected attacks: Record<string, Attack> = {};
  protected vulnerabilityIndex: number;

  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = 0,
    isBlocking: boolean = false,
    rageSuceptibility: boolean = false,
    vulnerabilityIndex: number = 0.7,
  ) {
    this.name = name;
    this.health = health;
    this.strength = strength;
    this.speed = speed;
    this.blockFail = blockFail;
    this.isBlocking = isBlocking;
    this.stamina = 100;
    this.rageSuceptibility = rageSuceptibility;
    this.vulnerabilityIndex = vulnerabilityIndex;
  }

  async getStats(): Promise<void> {
    await typeText(
      chalk.bgGreen(
        `Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength} speed: ${this.speed} stamina: ${this.stamina}\n`,
      ),
      1,
    );
  }

  setAttack(attacks: Record<string, Attack>): void {
    this.attacks = attacks;
  }

  async useAttack(name: string, target: Fighter): Promise<void> {
    const attack = this.attacks?.[name];
    if (!attack) {
      await typeText(
        chalk.bgRed(`${this.name} does not know an attack called "${name}"!\n`),
      );
      return;
    }

    if (attack.staminaCost && this.stamina < attack.staminaCost) {
      await typeText(
        chalk.bgRed(
          `${this.name} does not have enough stamina to use "${attack.name}"!\n`,
        ),
      );
      return;
    }

    if (this.rageMode()) {
      await typeText(
        chalk.bgRed(`${this.name} is getting angry and attacks with rage!\n`),
      );
      this.rageSuceptibility = false;
      await typeText(
        chalk.bgRed.bold(
          `${this.name} attacks ${target.name} two times because of his lack of control!\n`,
        ),
      );
      await this.useAttack(name, target);
      if (!validateLife(this)) return;
      await this.useAttack(name, target);
      if (!validateLife(this)) return;
      this.stamina = 0;
      await typeText(
        chalk.bgRed.bold(`${this.name} is getting tired after rage!\n`),
      );

      return;
    }

    if (attack.staminaCost) this.stamina -= attack.staminaCost;
    await attack.execute(this, target);
    this.isBlocking = false;
  }

  getAttackNames(): Attack[] {
    return Object.values(this.attacks);
  }

  getStrength(): number {
    return this.strength;
  }

  async receiveDamage(damage: number, oponent: Fighter): Promise<void> {
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
      this.health -= damage * 1.2 * this.vulnerabilityIndex;
      await typeText(
        chalk.bgRed(
          `${this.name} has received ${(damage * 1.2 * this.vulnerabilityIndex).toFixed(2)} damage!\n`,
        ),
      );
    } else {
      this.health -= damage * this.vulnerabilityIndex;
      await typeText(
        chalk.bgRed(
          `${this.name} has received ${(damage * this.vulnerabilityIndex).toFixed(2)} damage!\n`,
        ),
      );
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

  async block(): Promise<void> {
    const blockChance = Math.random();
    await typeText(chalk.bgYellow(`${this.name} covers!\n`));
    this.stamina -= 5;
    if (blockChance > this.blockFail) {
      this.isBlocking = true;
    } else {
      this.isBlocking = false;
    }
    this.blockFail += 0.2;
  }

  async recoverHealth(): Promise<void> {
    const recoveryAmount = Math.floor(Math.random() * 20) + 10;
    this.health += recoveryAmount;
    this.stamina += 10;
    await typeText(
      chalk.bgCyan(
        `${this.name} has recovered ${recoveryAmount} health and gained 10 stamina!\n`,
      ),
    );
    if (this.health > 100) this.health = 100;
    if (this.stamina > 100) this.stamina = 100;
  }

  async recoverStamina(): Promise<void> {
    const recoveryAmount = Math.floor(Math.random() * 7) + 3;
    this.stamina += recoveryAmount;
    await typeText(
      chalk.bgMagenta(
        `${this.name} has recovered ${recoveryAmount} stamina!\n`,
      ),
    );
    if (this.stamina > 100) {
      this.stamina = 100;
    }
  }

  getHealth(): number {
    return this.health;
  }

  getSpeed(): number {
    return this.speed;
  }

  getBlockFail(): number {
    return this.blockFail;
  }

  checkIfTired(): boolean {
    return this.stamina <= 15;
  }

  rageMode(): boolean {
    return this.health <= 30 && this.stamina > 20 && this.rageSuceptibility;
  }

  isCurrentlyBlocking(): boolean {
    return this.isBlocking;
  }

  breakGuard(target: Fighter): void {
    target.isBlocking = false;
  }

  getFighterClass(): string {
    return "Fighter";
  }

  updateVulnerabilityIndex(sum: number): void {
    this.vulnerabilityIndex += sum;
  }
}
