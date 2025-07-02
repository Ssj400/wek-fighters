export function addMuteButton(scene: Phaser.Scene, x: number, y: number) {
  let isMuted = scene.sound.mute;

  const soundButton = scene.add
    .image(x, y, isMuted ? "mute-icon" : "sound-icon")
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(10);

  soundButton.on("pointerdown", () => {
    isMuted = !isMuted;
    scene.sound.mute = isMuted;
    soundButton.setTexture(isMuted ? "mute-icon" : "sound-icon");
  });

  soundButton.on("pointerover", () => {
    soundButton.setTint(0xffffaa);
    soundButton.setScale(1.1);
  });

  soundButton.on("pointerout", () => {
    soundButton.clearTint();
    soundButton.setScale(1);
  });

  return soundButton;
}

export function addFullScreenButton(scene: Phaser.Scene, x: number, y: number) {
  const fullScreenButton = scene.add
    .text(x, y, "⛶", {
      fontSize: "24px",
      color: "#fff",
      padding: { x: 10, y: 5 },
    })
    .setInteractive()
    .setDepth(100);

  fullScreenButton.on("pointerdown", () => {
    if (scene.scale.isFullscreen) {
      scene.scale.stopFullscreen();
    } else {
      scene.scale.startFullscreen();
    }
  });

  fullScreenButton.on("pointerover", () => {
    fullScreenButton.setTint(0xffffaa);
    fullScreenButton.setScale(1.1);
  });

  fullScreenButton.on("pointerout", () => {
    fullScreenButton.clearTint();
    fullScreenButton.setScale(1);
  });

  return fullScreenButton;
}
