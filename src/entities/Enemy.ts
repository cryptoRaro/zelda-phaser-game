import Phaser from 'phaser';
import Player from './Player';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  private player!: Player;
  private health: number = 30;
  private speed: number = 80;
  private detectionRange: number = 200;
  private attackRange: number = 40;
  private attackCooldown: boolean = false;
  private enemyState: 'idle' | 'patrol' | 'chase' | 'attack' = 'idle';
  private stateTimer: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
    super(scene, x, y, 'enemy');
    
    this.player = player;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setSize(28, 28);
    this.setOffset(2, 2);
    this.setTint(0xff0000);
  }

  update(time: number, delta: number): void {
    if (!this.active) return;

    this.stateTimer -= delta;

    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.player.x, this.player.y
    );

    // State machine
    switch (this.enemyState) {
      case 'idle':
        this.handleIdleState(distanceToPlayer);
        break;
      case 'patrol':
        this.handlePatrolState(distanceToPlayer);
        break;
      case 'chase':
        this.handleChaseState(distanceToPlayer);
        break;
      case 'attack':
        this.handleAttackState(distanceToPlayer);
        break;
    }
  }

  private handleIdleState(distanceToPlayer: number): void {
    this.setVelocity(0, 0);
    
    if (distanceToPlayer < this.detectionRange) {
      this.changeState('chase');
    } else if (this.stateTimer <= 0) {
      this.changeState('patrol');
    }
  }

  private handlePatrolState(distanceToPlayer: number): void {
    if (distanceToPlayer < this.detectionRange) {
      this.changeState('chase');
      return;
    }

    // Simple patrol: move in a random direction for a bit
    if (this.stateTimer <= 0) {
      const angle = Math.random() * Math.PI * 2;
      this.setVelocity(
        Math.cos(angle) * this.speed * 0.5,
        Math.sin(angle) * this.speed * 0.5
      );
      this.stateTimer = 2000 + Math.random() * 2000;
    }
  }

  private handleChaseState(distanceToPlayer: number): void {
    if (distanceToPlayer > this.detectionRange * 1.5) {
      this.changeState('idle');
      return;
    }

    if (distanceToPlayer < this.attackRange) {
      this.changeState('attack');
      return;
    }

    // Move towards player
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      this.player.x, this.player.y
    );

    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );

    // Darken tint when chasing
    this.setTint(0xcc0000);
  }

  private handleAttackState(distanceToPlayer: number): void {
    this.setVelocity(0, 0);

    if (distanceToPlayer > this.attackRange * 1.5) {
      this.changeState('chase');
      return;
    }

    if (!this.attackCooldown) {
      this.attack();
    }
  }

  private attack(): void {
    this.attackCooldown = true;
    
    // Visual feedback
    this.setTint(0xff8800);
    
    // Lunge towards player
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      this.player.x, this.player.y
    );

    this.setVelocity(
      Math.cos(angle) * this.speed * 2,
      Math.sin(angle) * this.speed * 2
    );

    // Check if we hit the player
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.player.x, this.player.y
    );

    if (distance < 35) {
      this.player.takeDamage(10);
    }

    this.scene.time.delayedCall(200, () => {
      this.setVelocity(0, 0);
      this.clearTint();
      this.setTint(0xff0000);
    });

    this.scene.time.delayedCall(1500, () => {
      this.attackCooldown = false;
    });
  }

  private changeState(newState: typeof this.enemyState): void {
    this.enemyState = newState;
    this.stateTimer = 1000;
  }

  public takeDamage(amount: number): void {
    this.health -= amount;
    
    // Visual feedback
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      this.setTint(0xff0000);
    });

    if (this.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    // Death animation
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0,
      duration: 300,
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
