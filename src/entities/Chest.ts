import Phaser from 'phaser';

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  private opened: boolean = false;
  private contents: 'key' | 'health' | 'coins';

  constructor(scene: Phaser.Scene, x: number, y: number, contents: 'key' | 'health' | 'coins' = 'coins') {
    super(scene, x, y, 'chest');
    
    this.contents = contents;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setImmovable(true);
    this.setSize(32, 32);
    this.setTint(0xffaa00);
  }

  public open(): void {
    if (this.opened) return;

    this.opened = true;
    
    // Visual feedback - change color to indicate opened
    this.setTint(0x886600);

    // Spawn the contents
    this.spawnContents();

    // Play opening animation
    this.scene.tweens.add({
      targets: this,
      scaleY: 1.2,
      duration: 100,
      yoyo: true
    });
  }

  private spawnContents(): void {
    let item: Phaser.GameObjects.Sprite;

    switch (this.contents) {
      case 'key':
        item = this.scene.add.sprite(this.x, this.y - 40, 'key');
        item.setTint(0xffff00);
        this.scene.events.emit('keyCollected');
        break;
      case 'health':
        item = this.scene.add.sprite(this.x, this.y - 40, 'key');
        item.setTint(0xff0000);
        this.scene.events.emit('healthCollected', 30);
        break;
      case 'coins':
      default:
        item = this.scene.add.sprite(this.x, this.y - 40, 'key');
        item.setTint(0xffdd00);
        this.scene.events.emit('coinsCollected', 10);
        break;
    }

    // Animate the item popping out
    this.scene.tweens.add({
      targets: item,
      y: this.y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        item.destroy();
      }
    });
  }

  public isOpened(): boolean {
    return this.opened;
  }
}
