import { Logger } from "../common/Logger";
import { FightScene } from "../scenes/FightScene";

export class GameManager {
  private static instance: GameManager;
  private currentScene: FightScene | null = null;

  // eslint-disable-next-line no-empty-function
  private constructor() {}

  static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public setCurrentScene(scene: FightScene): void {
    this.currentScene = scene;
  }

  public createLogger(context: string): Logger {
    if (!this.currentScene) {
      return new Logger(null, context);
    }
    return new Logger(this.currentScene, context);
  }
}
