# Zelda-Style Adventure Game

A top-down adventure game inspired by The Legend of Zelda, built with Phaser 3 and TypeScript.

## Features

### Core Gameplay
- **Player Character**: Control a hero with smooth 8-directional movement
- **Combat System**: Attack enemies with space bar, with attack cooldowns
- **Enemy AI**: Enemies with state machines (idle, patrol, chase, attack)
- **Health System**: Player and enemy health with visual feedback
- **Invincibility Frames**: Temporary invincibility after taking damage

### Game Elements
- **Dungeon Design**: Procedurally placed walls and obstacles
- **Interactable Objects**: Chests containing keys, health, or coins
- **Collectibles**: Keys and coins system
- **UI System**: Health bar, item counters, and controls display

### Technical Features
- TypeScript for type safety
- Webpack dev server with hot reload
- Phaser 3 physics system
- State management and event system
- Modular entity system

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zelda-phaser-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Controls

- **WASD Keys**: Move the player character
- **Space Bar**: Attack enemies
- **E Key**: Interact with objects (open chests)

## Game Structure

### Scenes
- **BootScene**: Initial game setup
- **PreloadScene**: Asset loading with progress bar
- **MainMenuScene**: Start menu with instructions
- **GameScene**: Main gameplay scene
- **UIScene**: HUD overlay with health and stats

### Entities
- **Player**: Player character with movement, combat, and health
- **Enemy**: AI-controlled enemies with state machines
- **Chest**: Interactable containers with various rewards

## Development Guide

### Adding New Enemies

```typescript
// In GameScene.ts
const newEnemy = new Enemy(this, x, y, this.player);
this.enemies.add(newEnemy);
```

### Adding New Chests

```typescript
// In GameScene.ts
const chest = new Chest(this, x, y, 'key'); // 'key', 'health', or 'coins'
this.chests.add(chest);
```

### Custom Enemy Behavior

Modify the Enemy class state machine in `src/entities/Enemy.ts`:
- `handleIdleState`: Enemy standing still
- `handlePatrolState`: Enemy wandering
- `handleChaseState`: Enemy pursuing player
- `handleAttackState`: Enemy attacking player

## Extending the Game

### Planned Features
- More enemy types (spiders, wisps, boss)
- Room transition system
- Puzzle mechanics (pressure plates, locked doors)
- Item throwing and carrying
- Save/load system
- Sound effects and music
- Particle effects
- More complex dungeon layouts
- Boss battles
- Inventory system
- Equipment and power-ups

### Adding Sprite Sheets

Replace placeholder graphics in `PreloadScene.ts`:

```typescript
this.load.spritesheet('player', 'assets/player.png', {
  frameWidth: 32,
  frameHeight: 32
});
```

### Adding Animations

In Player or Enemy class:

```typescript
this.anims.create({
  key: 'walk-down',
  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
  frameRate: 10,
  repeat: -1
});
```

## Course Reference

This game is based on the "How To Make A Zelda-Like Game With Phaser 3" course:
- 11+ hours of content
- TypeScript fundamentals
- Player creation and movement
- Enemy AI and state machines
- Level design with Tiled
- Combat and collision systems
- UI components
- Game state management

## Project Structure

```
zelda-phaser-game/
├── src/
│   ├── entities/         # Game entities (Player, Enemy, Chest)
│   ├── scenes/           # Game scenes
│   ├── utils/            # Utility functions
│   ├── config/           # Game configuration
│   ├── main.ts           # Entry point
│   └── index.html        # HTML template
├── assets/               # Game assets (sprites, audio)
├── dist/                 # Built files
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Troubleshooting

### Black Screen
- Check browser console for errors
- Ensure assets are loaded correctly
- Verify physics bodies are set up properly

### Player Not Moving
- Check keyboard input setup
- Verify physics is enabled on player
- Ensure update() is being called

### Collisions Not Working
- Verify physics bodies exist
- Check collision setup in GameScene
- Enable debug mode to visualize hitboxes

## License

MIT License - Feel free to use this project for learning and personal projects.

## Credits

- Built with [Phaser 3](https://phaser.io/)
- Inspired by The Legend of Zelda
- Based on Scott Westover's tutorial series

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
