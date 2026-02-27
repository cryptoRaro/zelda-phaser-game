import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingGraphics();

    // Create simple placeholder graphics for now
    // In a real game, you would load sprite sheets and assets here
    this.createPlaceholderAssets();

    // Update loading bar
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x88ff88, 1);
      this.progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.loadingBar.destroy();
    });
  }

  create(): void {
    console.log('PreloadScene: Assets loaded');
    this.scene.start('MainMenuScene');
  }

  private createLoadingGraphics(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x222222, 1);
    this.loadingBar.fillRect(240, 270, 320, 50);

    this.progressBar = this.add.graphics();
  }

  private createPlaceholderAssets(): void {
    // Create simple colored rectangles as placeholders for sprites
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Player
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('player', 32, 32);
    graphics.clear();

    // Enemy
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('enemy', 32, 32);
    graphics.clear();

    // Chest
    graphics.fillStyle(0xffaa00, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('chest', 32, 32);
    graphics.clear();

    // Key
    graphics.fillStyle(0xffff00, 1);
    graphics.fillRect(0, 0, 16, 16);
    graphics.generateTexture('key', 16, 16);
    graphics.clear();

    // Door
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillRect(0, 0, 32, 64);
    graphics.generateTexture('door', 32, 64);
    graphics.clear();

    // Wall tile
    graphics.fillStyle(0x666666, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('wall', 32, 32);
    graphics.clear();

    // Floor tile
    graphics.fillStyle(0x999999, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('floor', 32, 32);
    graphics.clear();
  }
}
