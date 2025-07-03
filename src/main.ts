import "./style.css";
import Phaser from "phaser";
import { FightScene } from "./scenes/FightScene";
import { CharacterSelectScene } from "./scenes/CharacterSelectScene";
import { MenuScene } from "./scenes/MenuScene";
import { SelectDifficultyScene } from "./scenes/SelectDifficultyScene";
import { LoadingScene } from "./scenes/LoadingScene";
import { LoadingMenuScene } from "./scenes/LoadingMenuScene";

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
  scene: [
    MenuScene,
    SelectDifficultyScene,
    LoadingMenuScene,
    CharacterSelectScene,
    LoadingScene,
    FightScene,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
