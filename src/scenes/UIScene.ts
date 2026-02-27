import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  private healthBar!: Phaser.GameObjects.Graphics;
  private healthBarBackground!: Phaser.GameObjects.Graphics;
  private healthText!: Phaser.GameObjects.Text;
  private keysText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  
  private currentHealth: number = 100;
  private maxHealth: number = 100;
  private keys: number = 0;
  private coins: number = 0;

  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create(): void {
    // Create UI elements
    this.createHealthBar();
    this.createStatsDisplay();

    // Listen to game events
    const gameScene = this.scene.get('GameScene');
    
    gameScene.events.on('playerHealthChanged', (health: number, maxHealth: number) => {
      this.updateHealth(health, maxHealth);
    });

    gameScene.events.on('keyCollected', () => {
      this.keys++;
      this.updateStats();
    });

    gameScene.events.on('coinsCollected', (amount: number) => {
      this.coins += amount;
      this.updateStats();
    });
  }

  private createHealthBar(): void {
    const x = 20;
    const y = 20;
    const width = 200;
    const height = 20;

    // Health bar background
    this.healthBarBackground = this.add.graphics();
    this.healthBarBackground.fillStyle(0x000000, 0.5);
    this.healthBarBackground.fillRect(x - 2, y - 2, width + 4, height + 4);

    // Health bar
    this.healthBar = this.add.graphics();
    this.updateHealthBar();

    // Health text
    this.healthText = this.add.text(x + width + 10, y + 2, `${this.currentHealth}/${this.maxHealth}`, {
      fontSize: '16px',
      color: '#ffffff'
    });
  }

  private createStatsDisplay(): void {
    const x = 20;
    const y = 50;

    // Keys display
    const keyIcon = this.add.rectangle(x, y, 16, 16, 0xffff00);
    this.keysText = this.add.text(x + 20, y - 8, `x ${this.keys}`, {
      fontSize: '16px',
      color: '#ffffff'
    });

    // Coins display
    const coinIcon = this.add.rectangle(x, y + 30, 16, 16, 0xffdd00);
    this.coinsText = this.add.text(x + 20, y + 22, `x ${this.coins}`, {
      fontSize: '16px',
      color: '#ffffff'
    });

    // Controls reminder
    this.add.text(20, 550, 'WASD: Move | Space: Attack | E: Interact', {
      fontSize: '14px',
      color: '#aaaaaa'
    });
  }

  private updateHealth(health: number, maxHealth: number): void {
    this.currentHealth = health;
    this.maxHealth = maxHealth;
    this.updateHealthBar();
    this.healthText.setText(`${Math.floor(this.currentHealth)}/${this.maxHealth}`);
  }

  private updateHealthBar(): void {
    this.healthBar.clear();

    const x = 20;
    const y = 20;
    const width = 200;
    const height = 20;

    const healthPercentage = this.currentHealth / this.maxHealth;
    const healthWidth = width * healthPercentage;

    // Color changes based on health percentage
    let color = 0x00ff00; // Green
    if (healthPercentage < 0.5) {
      color = 0xffaa00; // Orange
    }
    if (healthPercentage < 0.25) {
      color = 0xff0000; // Red
    }

    this.healthBar.fillStyle(color, 1);
    this.healthBar.fillRect(x, y, healthWidth, height);
  }

  private updateStats(): void {
    this.keysText.setText(`x ${this.keys}`);
    this.coinsText.setText(`x ${this.coins}`);
  }
}
