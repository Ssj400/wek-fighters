import Phaser from "phaser";
import { Fighter } from "../classes/Fighter";
import { createAllFighters } from "../common/fighters";
import { addFullScreenButton, addMuteButton } from "../common/uiHelpers";
import { playSound } from "../common/sound";
import type { Difficulty } from "../types/types";

export class CharacterSelectScene extends Phaser.Scene {
  private descriptionText?: Phaser.GameObjects.Text;
  private selectedPlayer?: Fighter;
  private selectedOpponent?: Fighter;
  private allFighters: Record<string, Fighter> = {};
  private currentPhase: "choose-player" | "choose-opponent" | "ready" =
    "choose-player";
  private infoText?: Phaser.GameObjects.Text;
  private difficulty!: Difficulty;
  private returnToMenuCounter: number = 0;

  constructor() {
    super("CharacterSelectScene");
    this.allFighters = createAllFighters();
  }

  init(data: { difficulty: Difficulty }) {
    this.difficulty = data.difficulty;
  }

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.add.rectangle(500, 300, 1000, 600, 0x111111);
    this.infoText = this.add
      .text(500, 50, "Choose Your Fighter", {
        fontSize: "36px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    addMuteButton(this, 950, 50);
    addFullScreenButton(this, 50, 50);

    this.add
      .text(500, 290, "Description", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.descriptionText = this.add
      .text(500, 180, "", {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setVisible(false);

    const fighters = [
      {
        key: "Mati",
        name: "Mati",
        x: 200,
        y: 220,
        description:
          "A beast in the ring, no one\ncan match his destructive power.\nOutside of the ring, he is\na millionare businessman. A genius\nin all his senses.\nSPECIALTY: PUNCHER\n",
      },
      {
        key: "Juan",
        name: "Juan",
        x: 800,
        y: 220,
        description:
          "Don't underestimate him thinking\nhe's just a skinny guy.\nHe's part of an ancient reptilian race\nthat has been training for centuries.\nTruthfully a master of counter-attacks.\nSPECIALTY: COUNTER-PUNCHER\n",
      },
      {
        key: "Alan",
        name: "Alan",
        x: 400,
        y: 420,
        description:
          "He attended to all shrek's classes\non thursday's and was able to learn\nall the techniques of the legendary\nogre. Now he is a master of the\nswamps. He is also a great dancer.\nSPECIALTY: PUNCHER\n",
      },
      {
        key: "Jefte",
        name: "Jefte",
        x: 600,
        y: 420,
        description:
          "Coming directly from the great\nINCA EMPIRE, throughout all his\ntravels on the peruvian deserts among\nthe llamas, he learned secret techniques\nthat could destroy any kind of\nspecies.\nSPECIALTY: DEFENDER\n",
      },
      {
        key: "Gaspar",
        name: "Gaspar",
        x: 800,
        y: 420,
        description:
          "An ancient warrior from the\nbunny lands of the east.\nHe has been training for centuries\nand is now a master of the\nbunny tricks. If he measures\nthe distance, his power gets increased\n(distance control condition: 3\nconsecutive jabs)\nSPECIALTY: OUTBOXER\n",
      },
      {
        key: "Jose",
        name: "Jose",
        x: 200,
        y: 420,
        description: "",
      },
    ];

    fighters.forEach((fighter) => {
      const box = this.add
        .rectangle(fighter.x, fighter.y, 180, 180, 0x222222)
        .setStrokeStyle(2, 0xffffff);
      let img: Phaser.GameObjects.Image;
      if (fighter.key === "Coming soon") {
        img = this.add.image(fighter.x, fighter.y, "question-mark");
        img.setDisplaySize(180, 180);
        img.setOrigin(0.5, 0.5);
        img.setTint(0x888888);
        img.setDisplaySize(240, 180);
      } else {
        img = this.add.image(fighter.x, fighter.y, `${fighter.key}-selection`);
        img.setDisplaySize(180, 180);
      }

      const backText = this.add
        .text(900, 550, "Go back", {
          fontSize: "20px",
          color: "#ffffff",
        })
        .setOrigin(1, 0.5)
        .setInteractive()
        .setDepth(10);

      backText.on("pointerdown", () => {
        this.scene.start("SelectDifficultyScene");
        playSound(this, "click", { volume: 0.5 });
      });

      backText.on("pointerover", () => {
        backText.setStyle({ color: "#ff0" });
      });

      backText.on("pointerout", () => {
        backText.setStyle({ color: "#ffffff" });
      });

      this.add
        .text(100, 550, `Difficulty: ${this.difficulty.toUpperCase()}`, {
          fontSize: "20px",
          color: "#ffffff",
        })
        .setDepth(10)
        .setOrigin(0, 0.5);

      this.add
        .text(fighter.x, fighter.y + 60, fighter.name, {
          fontSize: "18px",
          color: "#ffffff",
        })
        .setOrigin(0.5);

      const hitbox = this.add
        .zone(fighter.x, fighter.y, 180, 180)
        .setRectangleDropZone(180, 180)
        .setInteractive();

      hitbox.on("pointerdown", () => {
        const fighterObj = this.allFighters[fighter.name];
        if (!fighterObj) return;
        playSound(this, "click", { volume: 0.3 });

        if (this.currentPhase === "choose-player") {
          box.setStrokeStyle(4, 0xffff00);
          this.selectedPlayer = fighterObj;
          this.currentPhase = "choose-opponent";
          this.infoText?.setText(`Choose opponent`);
        } else if (this.currentPhase === "choose-opponent") {
          if (fighterObj === this.selectedPlayer) {
            box.setStrokeStyle(2, 0xffffff);
            this.selectedPlayer = undefined;
            this.currentPhase = "choose-player";
            this.infoText?.setText("Choose Your Fighter");
            return;
          }

          this.sound.stopAll();
          playSound(this, "Start fight", { volume: 0.5 });
          this.currentPhase = "ready";
          this.selectedOpponent = fighterObj;
          this.cameras.main.fadeOut(1000, 0, 0, 0);
          this.returnToMenuCounter++;

          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("LoadingScene", {
              player: this.selectedPlayer,
              opponent: this.selectedOpponent,
              difficulty: this.difficulty,
            });
          });
        }
        if (this.currentPhase === "ready") {
          setTimeout(() => {
            this.currentPhase = "choose-player";
          }, 1000);
        }
        return;
      });

      hitbox.on("pointerover", () => {
        box.setFillStyle(0x444444);
        const fighterObj = this.allFighters[fighter.name];
        if (!fighterObj) return;
        const combinedText = `${fighter.description}\n${fighterObj.getMenuStats()}`;
        this.descriptionText!.setText(combinedText);
        this.descriptionText!.setVisible(true);
      });

      hitbox.on("pointerout", () => {
        box.setFillStyle(0x222222);
        this.descriptionText!.setVisible(false);
      });
    });
  }
}
