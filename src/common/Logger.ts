import { FightScene } from "../scenes/FightScene";

export class Logger {
  private context: string;
  private scene: FightScene | null;

  constructor(scene: FightScene | null, context: string) {
    this.scene = scene;
    this.context = context;
  }

  private async logToFightText(message: string): Promise<void> {
    if (this.scene) {
      await this.scene.logToFightText(message);
    }
  }

  async info(message: string) {
    console.log(`[${this.context}] ${message}`);
    await this.logToFightText(message);
  }

  async warning(message: string) {
    console.warn(`[${this.context}] ${message}`);
    await this.logToFightText(message);
  }

  async error(message: string) {
    console.error(`[${this.context}] ${message}`);
    await this.logToFightText(message);
  }
}
