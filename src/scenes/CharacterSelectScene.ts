import Phaser from "phaser";
import { Fighter } from "../classes/Fighter";
import { createAllFighters } from "../common/fighters";
import { addMuteButton } from "../common/uiHelpers";

export class CharacterSelectScene extends Phaser.Scene {
  private descriptionText?: Phaser.GameObjects.Text;
  private selectedPlayer?: Fighter;
  private selectedOpponent?: Fighter;
  private allFighters: Record<string, Fighter> = {};
  private currentPhase: "choose-player" | "choose-opponent" | "ready" =
    "choose-player";
  private infoText?: Phaser.GameObjects.Text;

  constructor() {
    super("CharacterSelectScene");
    this.allFighters = createAllFighters();
  }

  preload() {
    this.load.image("Mati-selection", "assets/mati-selection.png");
    this.load.image("Juan-selection", "assets/juan-selection.png");
    this.load.image("Alan-selection", "assets/alan-selection.png");
    this.load.image("Jefte-selection", "assets/jefte-selection.png");
    this.load.image("question-mark", "assets/question-mark.png");
    this.load.image("sound-icon", "assets/sound-icon.png");
    this.load.image("mute-icon", "assets/mute-icon.png");

    this.load.audio("click", "assets/sfx/click.wav");
    this.load.audio("Start fight", "assets/sfx/start-fight.mp3");
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
    const clickSound = this.sound.add("click");
    const startFightSound = this.sound.add("Start fight");

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
          "Very strong fighter, a puncher in all\nsenses. His slowness is compensated\nby his high damage output.\n",
      },
      {
        key: "Juan",
        name: "Juan",
        x: 800,
        y: 220,
        description: "Strong and resilient.\n",
      },
      {
        key: "Alan",
        name: "Alan",
        x: 400,
        y: 420,
        description: "Balanced fighter with good stamina.\n",
      },
      {
        key: "Jefte",
        name: "Jefte",
        x: 600,
        y: 420,
        description: "A fighter with unpredictable moves.\n",
      },
      {
        key: "Coming soon",
        name: "Coming soon!",
        x: 800,
        y: 420,
        description: "",
      },
      {
        key: "Coming soon",
        name: "Coming soon!",
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
        clickSound.play();

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

          startFightSound.play();
          this.currentPhase = "ready";
          this.selectedOpponent = fighterObj;
          this.cameras.main.fadeOut(1000, 0, 0, 0);

          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("FightScene", {
              player: this.selectedPlayer,
              opponent: this.selectedOpponent,
            });
          });
        }
        if (this.currentPhase === "ready") {
          setTimeout(() => {
            this.currentPhase = "choose-player";
          }, 1000);
          return;
        }
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
