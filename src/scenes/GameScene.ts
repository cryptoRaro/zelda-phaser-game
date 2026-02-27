import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import Chest from '../entities/Chest';

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemies!: Phaser.GameObjects.Group;
  private chests!: Phaser.GameObjects.Group;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private keys: number = 0;
  private coins: number = 0;
  private darkness!: Phaser.GameObjects.RenderTexture;
  private lightSprite!: Phaser.GameObjects.Image;
  private readonly LIGHT_SIZE: number = 350;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    console.log('GameScene: Creating game world...');

    // Create the dungeon
    this.createDungeon();

    // Create player
    this.player = new Player(this, 400, 300);

    // Create enemies
    this.enemies = this.add.group({
      classType: Enemy,
      runChildUpdate: true
    });

    this.spawnEnemies();

    // Create chests
    this.chests = this.add.group({
      classType: Chest
    });

    this.spawnChests();

    // Set up collisions
    this.setupCollisions();

    // Set up events
    this.setupEvents();

    // Camera follow player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1);

    // Lighting
    this.setupLighting();
  }

  update(time: number, delta: number): void {
    this.player.update();

    // Check for interaction with chests
    this.checkChestInteraction();

    // Update torch lighting each frame
    this.updateLighting();
  }

  private createDungeon(): void {
    // Create walls
    this.walls = this.physics.add.staticGroup();

    // Create a simple room with walls
    const roomWidth = 25;
    const roomHeight = 19;
    const tileSize = 32;

    // Top wall
    for (let x = 0; x < roomWidth; x++) {
      const wall = this.walls.create(x * tileSize, 0, 'wall');
      wall.setSize(tileSize, tileSize);
      wall.setDepth(1);
      wall.refreshBody();
    }

    // Bottom wall
    for (let x = 0; x < roomWidth; x++) {
      const wall = this.walls.create(x * tileSize, (roomHeight - 1) * tileSize, 'wall');
      wall.setSize(tileSize, tileSize);
      wall.setDepth(1);
      wall.refreshBody();
    }

    // Left wall
    for (let y = 1; y < roomHeight - 1; y++) {
      const wall = this.walls.create(0, y * tileSize, 'wall');
      wall.setSize(tileSize, tileSize);
      wall.setDepth(1);
      wall.refreshBody();
    }

    // Right wall
    for (let y = 1; y < roomHeight - 1; y++) {
      const wall = this.walls.create((roomWidth - 1) * tileSize, y * tileSize, 'wall');
      wall.setSize(tileSize, tileSize);
      wall.setDepth(1);
      wall.refreshBody();
    }

    // Add some interior walls/obstacles
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(3, roomWidth - 4) * tileSize;
      const y = Phaser.Math.Between(3, roomHeight - 4) * tileSize;
      const wall = this.walls.create(x, y, 'wall');
      wall.setSize(tileSize, tileSize);
      wall.setDepth(1);
      wall.refreshBody();
    }

    // Create floor tiles for visual
    for (let x = 1; x < roomWidth - 1; x++) {
      for (let y = 1; y < roomHeight - 1; y++) {
        const floor = this.add.image(x * tileSize, y * tileSize, 'floor');
        floor.setDepth(0);
      }
    }
  }

  private spawnEnemies(): void {
    // Spawn a few enemies in random locations
    const spawnPoints = [
      { x: 200, y: 200 },
      { x: 600, y: 200 },
      { x: 200, y: 400 },
      { x: 600, y: 400 },
      { x: 400, y: 150 }
    ];

    spawnPoints.forEach(point => {
      const enemy = new Enemy(this, point.x, point.y, this.player);
      this.enemies.add(enemy);
    });
  }

  private spawnChests(): void {
    // Spawn chests with different contents
    const chestData = [
      { x: 150, y: 150, contents: 'key' as const },
      { x: 650, y: 150, contents: 'health' as const },
      { x: 150, y: 450, contents: 'coins' as const },
      { x: 650, y: 450, contents: 'coins' as const }
    ];

    chestData.forEach(data => {
      const chest = new Chest(this, data.x, data.y, data.contents);
      this.chests.add(chest);
    });
  }

  private setupCollisions(): void {
    // Player collisions
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.player, this.chests);

    // Enemy collisions
    this.physics.add.collider(this.enemies, this.walls);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.enemies, this.chests);

    // Player-Enemy overlap for damage
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyCollision as any,
      undefined,
      this
    );
  }

  private setupEvents(): void {
    // Player attack event
    this.events.on('playerAttack', (attackX: number, attackY: number) => {
      this.handlePlayerAttack(attackX, attackY);
    });

    // Player health changed
    this.events.on('playerHealthChanged', (health: number, maxHealth: number) => {
      // UI will handle this
    });

    // Player died
    this.events.on('playerDied', () => {
      this.handlePlayerDeath();
    });

    // Item collection events
    this.events.on('keyCollected', () => {
      this.keys++;
      console.log('Key collected! Total keys:', this.keys);
    });

    this.events.on('healthCollected', (amount: number) => {
      this.player.heal(amount);
      console.log('Health collected!');
    });

    this.events.on('coinsCollected', (amount: number) => {
      this.coins += amount;
      console.log('Coins collected! Total coins:', this.coins);
    });
  }

  private checkChestInteraction(): void {
    const eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    if (Phaser.Input.Keyboard.JustDown(eKey)) {
      this.chests.getChildren().forEach((chest: any) => {
        const distance = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          chest.x, chest.y
        );

        if (distance < 50 && !chest.isOpened()) {
          chest.open();
        }
      });
    }
  }

  private handlePlayerAttack(attackX: number, attackY: number): void {
    // Check if any enemies are in attack range
    this.enemies.getChildren().forEach((enemy: any) => {
      const distance = Phaser.Math.Distance.Between(
        attackX, attackY,
        enemy.x, enemy.y
      );

      if (distance < 45) {
        enemy.takeDamage(20);
      }
    });
  }

  private handlePlayerEnemyCollision(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    // Damage is handled in Enemy class during attack
  }

  private setupLighting(): void {
    const size = this.LIGHT_SIZE;

    // Build a radial-gradient canvas texture (white centre → transparent edge)
    // used as the "erase stamp" each frame so the centre is fully revealed
    // and the edge fades smoothly into darkness.
    const lightTex = this.textures.createCanvas('torchLight', size, size) as Phaser.Textures.CanvasTexture;
    const ctx = lightTex.context;
    const cx = size / 2;
    const gradient = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
    gradient.addColorStop(0,    'rgba(255,255,255,1)');
    gradient.addColorStop(0.4,  'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.72, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(1,    'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    lightTex.refresh();

    // Off-scene image used purely as an erase stamp on the RenderTexture
    this.lightSprite = this.make.image({ key: 'torchLight', add: false });

    // Full-screen darkness overlay fixed to the camera
    const { width, height } = this.scale;
    this.darkness = this.add.renderTexture(0, 0, width, height)
      .setScrollFactor(0)
      .setDepth(80);
  }

  private updateLighting(): void {
    if (!this.player.active) return;

    const cam = this.cameras.main;
    const px = this.player.x - cam.worldView.x;
    const py = this.player.y - cam.worldView.y;
    const half = this.LIGHT_SIZE / 2;

    // Subtle per-frame flicker
    const flicker = 0.93 + Math.random() * 0.07;
    this.lightSprite.setScale(flicker);

    this.darkness.clear();
    this.darkness.fill(0x000000, 0.82);
    this.darkness.erase(this.lightSprite, px - half, py - half);
  }

  private handlePlayerDeath(): void {
    console.log('Player died! Game Over');
    
    // Show game over text
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setScrollFactor(0)
      .setDepth(100);

    const gameOverText = this.add.text(width / 2, height / 2 - 50, 'Game Over', {
      fontSize: '64px',
      color: '#ff0000',
      fontStyle: 'bold'
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(101);

    const restartText = this.add.text(width / 2, height / 2 + 30, 'Click to Restart', {
      fontSize: '32px',
      color: '#ffffff'
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(101)
    .setInteractive({ useHandCursor: true });

    restartText.on('pointerdown', () => {
      this.scene.restart();
    });
  }
}
