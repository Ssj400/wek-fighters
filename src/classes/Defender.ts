import { Fighter } from "./Fighter";
import { FighterMoves } from "../types/types";
import { defaultValues } from "../common/defaultValues";
import { Logger } from "../common/Logger";
import { GameManager } from "../managers/GameManager";

export class Defender extends Fighter {
  logger: Logger;
  constructor(
    name: string,
    health: number,
    strength: number,
    speed: number,
    blockFail: number = defaultValues.common.blockFail,
    isBlocking: boolean = defaultValues.common.isBlocking,
    public defense: number,
    rageSuceptibility: boolean = defaultValues.common.rageSuceptibility,
    vulnerabilityIndex: number = defaultValues.defender.vulnerabilityIndex,
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
    return `Statistics | fighter: ${this.name}, health: ${this.health}, strength: ${this.strength}, stamina: ${this.stamina} *SPECIAL* defense: ${this.defense}, speed: ${this.speed}\n`;
  }

  override getFighterClass(): string {
    return "Defender";
  }

  override async receiveDamage(
    damage: number,
    oponent: Fighter,
  ): Promise<void> {
    if (this.isCurrentlyBlocking()) {
      await this.log(`${this.name} successfully blocked the attack!`);
      this.setLastMove(FighterMoves.BLOCK);
      if (this.onBlockCallback) this.onBlockCallback();
      return;
    } else if (await this.dodgeAttack(this.dodgePotenciator)) {
      oponent.updateVulnerabilityIndex(0.05);
      oponent.updateStamina(-5);
      return;
    }

    await this.log(`${this.name} failed to block the attack!\n`);

    if (this.stamina < 30) {
      await this.log(`${this.name} completely receives the attack! \n`);
      this.health -= Number(
        (damage * 1.2 * this.vulnerabilityIndex + 0.3).toFixed(2),
      );
      this.lastDamage = Number(
        (damage * 1.2 * this.vulnerabilityIndex + 0.3).toFixed(2),
      );
      this.defense = Math.max(this.defense - 2, 0);
      await this.log(
        `${this.name} has received ${(damage * 1.2 * this.vulnerabilityIndex + 0.3).toFixed(2)} damage!\n`,
      );
    } else {
      const reducedDamage = Math.max(0, damage - this.defense);
      this.defense = Math.max(this.defense - 1, 0);
      this.health -= Number(
        (reducedDamage * this.vulnerabilityIndex + 0.3).toFixed(2),
      );
      this.lastDamage = Number(
        (reducedDamage * this.vulnerabilityIndex + 0.3).toFixed(2),
      );
      await this.log(
        `${this.name} has received ${(reducedDamage * this.vulnerabilityIndex + 0.3).toFixed(2)} damage after defense!\n`,
      );
      this.stamina -= 10;
    }

    if (this.onDamageCallback) await this.onDamageCallback();

    await this.log(`${this.name}'s defense is now ${this.defense}\n`);

    if (this.health <= 0) {
      this.health = 0;
      if (this.onDeathCallback) this.onDeathCallback();
      await this.log(`${this.name} has been defeated!\n`);
      return;
    } else {
      await this.log(
        `${this.name}'s health is now ${this.health.toFixed(2)}\n`,
      );
    }
  }

  protected override createInstance(): Fighter {
    return new Defender(
      this.name,
      this.health,
      this.strength,
      this.speed,
      this.blockFail,
      this.isBlocking,
      this.defense,
      this.rageSuceptibility,
      this.vulnerabilityIndex,
    );
  }
}
