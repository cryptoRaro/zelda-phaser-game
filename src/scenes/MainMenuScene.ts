import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    this.add.text(width / 2, height / 3, 'Zelda-Style Adventure', {
      fontSize: '48px',
      color: '#ffff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Start button
    const startButton = this.add.text(width / 2, height / 2, 'Start Game', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#00aa00',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#00ff00' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#00aa00' });
    });

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });

    // Instructions
    this.add.text(width / 2, height * 0.7, 'WASD: Move\nSpace: Attack\nE: Interact', {
      fontSize: '20px',
      color: '#aaaaaa',
      align: 'center'
    }).setOrigin(0.5);
  }
}
