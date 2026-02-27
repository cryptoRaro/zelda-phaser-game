import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Load any essential assets needed for the preload screen
    // For now, we'll just transition directly
  }

  create(): void {
    console.log('BootScene: Starting game...');
    this.scene.start('PreloadScene');
  }
}
