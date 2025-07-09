import { FightScene } from "../scenes/FightScene";

type LogTarget = (message: string) => Promise<void>;

export class Logger {
  private logToFightText: LogTarget;

  constructor(scene: FightScene) {
    this.logToFightText = scene.logToFightText.bind(scene);
  }

  async info(message: string) {
    console.log(`[INFO] ${message}`);
    await this.logToFightText(message);
  }

  async warning(message: string) {
    console.warn(`[WARNING] ${message}`);
    await this.logToFightText(message);
  }

  async error(message: string) {
    console.error(`[ERROR] ${message}`);
    await this.logToFightText(message);
  }
}
