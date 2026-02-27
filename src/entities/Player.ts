import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private keys!: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
  };
  private speed: number = 160;
  public health: number = 100;
  public maxHealth: number = 100;
  private attackCooldown: boolean = false;
  private invincible: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set up physics
    this.setCollideWorldBounds(true);
    this.setDepth(10);

    // Initialize WASD input
    this.keys = {
      w: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // Set up size
    this.setSize(28, 28);
    this.setOffset(2, 2);

    // Left mouse button attacks
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown() && !this.attackCooldown) {
        this.attack();
      }
    });
  }

  update(): void {
    if (!this.active) return;

    this.handleMovement();
  }

  private handleMovement(): void {
    let velocityX = 0;
    let velocityY = 0;

    if (this.keys.a.isDown) {
      velocityX = -this.speed;
    } else if (this.keys.d.isDown) {
      velocityX = this.speed;
    }

    if (this.keys.w.isDown) {
      velocityY = -this.speed;
    } else if (this.keys.s.isDown) {
      velocityY = this.speed;
    }

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    this.setVelocity(velocityX, velocityY);

    // Visual feedback for movement direction
    if (velocityX < 0) {
      this.setTint(0x88ff88); // Green tint for left
    } else if (velocityX > 0) {
      this.setTint(0x88ff88); // Green tint for right
    } else if (velocityY < 0) {
      this.setTint(0x88ff88); // Green tint for up
    } else if (velocityY > 0) {
      this.setTint(0x88ff88); // Green tint for down
    } else {
      this.setTint(0x00ff00); // Bright green when still
    }
  }

  private attack(): void {
    this.attackCooldown = true;
    
    // Visual feedback for attack
    const originalTint = this.tintTopLeft;
    this.setTint(0xffff00); // Yellow flash for attack
    
    // Create attack hitbox in front of player
    const attackRange = 40;
    const attackX = this.x + (this.body!.velocity.x > 0 ? attackRange : 
                             this.body!.velocity.x < 0 ? -attackRange : 0);
    const attackY = this.y + (this.body!.velocity.y > 0 ? attackRange : 
                             this.body!.velocity.y < 0 ? -attackRange : 0);

    // Emit attack event for game scene to handle
    this.scene.events.emit('playerAttack', attackX, attackY);

    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    this.scene.time.delayedCall(500, () => {
      this.attackCooldown = false;
    });
  }

  public takeDamage(amount: number): void {
    if (this.invincible) return;

    this.health -= amount;
    this.health = Math.max(0, this.health);

    // Visual feedback
    this.setTint(0xff0000);
    this.scene.time.delayedCall(200, () => {
      this.clearTint();
    });

    // Emit health change event
    this.scene.events.emit('playerHealthChanged', this.health, this.maxHealth);

    // Invincibility frames
    this.invincible = true;
    this.scene.time.delayedCall(1000, () => {
      this.invincible = false;
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.scene.events.emit('playerHealthChanged', this.health, this.maxHealth);
  }

  private die(): void {
    this.setActive(false);
    this.setVisible(false);
    this.scene.events.emit('playerDied');
  }

  public reset(x: number, y: number): void {
    this.setPosition(x, y);
    this.health = this.maxHealth;
    this.setActive(true);
    this.setVisible(true);
    this.clearTint();
  }
}
