import "./style.css";
import Phaser from "phaser";
import { FightScene } from "./scenes/FightScene";
import { CharacterSelectScene } from "./scenes/CharacterSelectScene";
import { MenuScene } from "./scenes/MenuScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  backgroundColor: "#222",
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 0,
        x: 0,
      },
      debug: false,
    },
  },
  scene: [MenuScene, CharacterSelectScene, FightScene],
};

new Phaser.Game(config);
