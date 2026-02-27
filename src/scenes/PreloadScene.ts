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
    const g = this.make.graphics({ x: 0, y: 0 });

    // ── PLAYER (32×32) – green-tunic hero, front-facing ──────────────
    g.clear();
    // Legs
    g.fillStyle(0x1a4f1a, 1);
    g.fillRect(10, 24, 5, 7);
    g.fillRect(17, 24, 5, 7);
    // Tunic body
    g.fillStyle(0x2d7d2d, 1);
    g.fillRect(9, 13, 14, 13);
    // Belt
    g.fillStyle(0x8b4513, 1);
    g.fillRect(9, 22, 14, 2);
    // Arms (skin)
    g.fillStyle(0xf4c07a, 1);
    g.fillRect(5, 13, 5, 9);
    g.fillRect(22, 13, 5, 9);
    // Head
    g.fillStyle(0xf4c07a, 1);
    g.fillCircle(16, 9, 8);
    // Hair / hat
    g.fillStyle(0x2d7d2d, 1);
    g.fillRect(8, 3, 16, 5);
    g.fillTriangle(8, 5, 16, -1, 24, 5);
    // Eyes
    g.fillStyle(0x000000, 1);
    g.fillRect(12, 8, 2, 2);
    g.fillRect(18, 8, 2, 2);
    // Sword (right side)
    g.fillStyle(0xc0c0c0, 1);
    g.fillRect(26, 6, 2, 18);
    g.fillStyle(0x8b4513, 1);
    g.fillRect(23, 18, 8, 3);
    // Shield (left side)
    g.fillStyle(0x8b0000, 1);
    g.fillRect(3, 13, 5, 8);
    g.fillStyle(0xffd700, 1);
    g.fillRect(4, 15, 3, 3);
    g.generateTexture('player', 32, 32);

    // ── ENEMY (32×32) – horned demon ─────────────────────────────────
    g.clear();
    // Body
    g.fillStyle(0x6b0f0f, 1);
    g.fillCircle(16, 19, 11);
    // Horns
    g.fillStyle(0x3d0000, 1);
    g.fillTriangle(8, 12, 5, 2, 13, 10);
    g.fillTriangle(24, 12, 19, 10, 27, 2);
    // Inner face
    g.fillStyle(0x4a0a0a, 1);
    g.fillCircle(16, 19, 7);
    // Glowing eyes
    g.fillStyle(0xff4400, 1);
    g.fillCircle(12, 17, 3);
    g.fillCircle(20, 17, 3);
    g.fillStyle(0xff8800, 1);
    g.fillCircle(12, 17, 1);
    g.fillCircle(20, 17, 1);
    // Mouth / fangs
    g.fillStyle(0xffffff, 1);
    g.fillRect(12, 23, 2, 3);
    g.fillRect(18, 23, 2, 3);
    g.fillStyle(0xff0000, 1);
    g.fillRect(12, 23, 8, 2);
    g.generateTexture('enemy', 32, 32);

    // ── CHEST (32×32) ─────────────────────────────────────────────────
    g.clear();
    // Body
    g.fillStyle(0x8b4513, 1);
    g.fillRect(3, 17, 26, 12);
    // Lid
    g.fillStyle(0xa0522d, 1);
    g.fillRect(3, 9, 26, 10);
    // Lid highlight
    g.fillStyle(0xc68642, 1);
    g.fillRect(3, 9, 26, 3);
    // Metal band across middle
    g.fillStyle(0xb8860b, 1);
    g.fillRect(3, 17, 26, 2);
    // Corner brackets
    g.fillStyle(0xdaa520, 1);
    g.fillRect(3, 9, 4, 4);
    g.fillRect(25, 9, 4, 4);
    g.fillRect(3, 25, 4, 4);
    g.fillRect(25, 25, 4, 4);
    // Lock body
    g.fillStyle(0xffd700, 1);
    g.fillRect(13, 14, 6, 6);
    // Lock shackle
    g.fillStyle(0xdaa520, 1);
    g.fillCircle(16, 14, 3);
    g.fillStyle(0x8b6914, 1);
    g.fillCircle(16, 14, 1);
    g.generateTexture('chest', 32, 32);

    // ── KEY (16×16) ───────────────────────────────────────────────────
    g.clear();
    // Ring
    g.fillStyle(0xffd700, 1);
    g.fillCircle(6, 6, 5);
    g.fillStyle(0x000000, 1);
    g.fillCircle(6, 6, 2);
    // Shaft
    g.fillStyle(0xffd700, 1);
    g.fillRect(9, 5, 7, 2);
    // Teeth
    g.fillRect(11, 7, 2, 3);
    g.fillRect(14, 7, 2, 2);
    g.generateTexture('key', 16, 16);

    // ── DOOR (32×64) ──────────────────────────────────────────────────
    g.clear();
    // Frame
    g.fillStyle(0x3d1f00, 1);
    g.fillRect(0, 0, 32, 64);
    // Door panel
    g.fillStyle(0x8b4513, 1);
    g.fillRect(3, 3, 26, 58);
    // Panel insets
    g.fillStyle(0x6b3410, 1);
    g.fillRect(6, 6, 20, 24);
    g.fillRect(6, 34, 20, 24);
    // Highlight edges on panels
    g.fillStyle(0xa05a2c, 1);
    g.fillRect(6, 6, 20, 2);
    g.fillRect(6, 6, 2, 24);
    g.fillRect(6, 34, 20, 2);
    g.fillRect(6, 34, 2, 24);
    // Knob
    g.fillStyle(0xffd700, 1);
    g.fillCircle(22, 33, 3);
    g.fillStyle(0xb8860b, 1);
    g.fillCircle(22, 33, 1);
    g.generateTexture('door', 32, 64);

    // ── WALL (32×32) – stone brick ────────────────────────────────────
    g.clear();
    // Base
    g.fillStyle(0x4a4a5a, 1);
    g.fillRect(0, 0, 32, 32);
    // Brick faces (offset rows)
    g.fillStyle(0x555568, 1);
    g.fillRect(1, 1, 14, 9);
    g.fillRect(17, 1, 14, 9);
    g.fillRect(1, 12, 7, 9);
    g.fillRect(10, 12, 13, 9);
    g.fillRect(25, 12, 6, 9);
    g.fillRect(1, 23, 14, 8);
    g.fillRect(17, 23, 14, 8);
    // Top-left highlights on each brick
    g.fillStyle(0x6a6a7e, 1);
    g.fillRect(1, 1, 14, 1);
    g.fillRect(1, 1, 1, 9);
    g.fillRect(17, 1, 14, 1);
    g.fillRect(17, 1, 1, 9);
    g.fillRect(1, 12, 7, 1);
    g.fillRect(10, 12, 13, 1);
    g.fillRect(25, 12, 6, 1);
    g.fillRect(1, 23, 14, 1);
    g.fillRect(17, 23, 14, 1);
    g.generateTexture('wall', 32, 32);

    // ── FLOOR (32×32) – stone tiles ───────────────────────────────────
    g.clear();
    // Base grout
    g.fillStyle(0x5a5040, 1);
    g.fillRect(0, 0, 32, 32);
    // Four stone tiles
    g.fillStyle(0x7a6a55, 1);
    g.fillRect(1, 1, 14, 14);
    g.fillRect(17, 1, 14, 14);
    g.fillRect(1, 17, 14, 14);
    g.fillRect(17, 17, 14, 14);
    // Highlights
    g.fillStyle(0x8a7a65, 1);
    g.fillRect(1, 1, 14, 1);
    g.fillRect(1, 1, 1, 14);
    g.fillRect(17, 1, 14, 1);
    g.fillRect(17, 1, 1, 14);
    g.fillRect(1, 17, 14, 1);
    g.fillRect(1, 17, 1, 14);
    g.fillRect(17, 17, 14, 1);
    g.fillRect(17, 17, 1, 14);
    g.generateTexture('floor', 32, 32);

    g.destroy();
  }
}
