# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd zelda-phaser-game
npm install
```

### 2. Start the Game
```bash
npm start
```

### 3. Play!
Open your browser to `http://localhost:8080`

## Controls
- **WASD Keys** - Move your character
- **Space Bar** - Attack enemies  
- **E Key** - Open chests

## Game Tips

### Combat
- Attack enemies from a safe distance
- Watch your health bar (top left)
- Enemies have different AI behaviors - learn their patterns!

### Exploration
- Open chests to collect keys, health, and coins
- Use the 'E' key when near a chest to open it
- Keys and coins are displayed in the top left UI

### Strategy
- Enemies will chase you when you get close
- Use obstacles to block enemy movement
- Collect health from chests when you're low
- Attack cooldown means timing is important!

## Current Features

✅ Player movement (8 directions)
✅ Combat system with cooldowns
✅ Enemy AI (idle, patrol, chase, attack)
✅ Health system for player and enemies
✅ Interactable chests
✅ Collectible keys and coins
✅ UI with health bar and item counters
✅ Simple dungeon with walls and obstacles

## What's Next?

### Easy Additions
- Add sound effects
- Create more room layouts
- Add more enemy types
- Implement room transitions

### Advanced Features
- Boss battles
- Puzzle mechanics (switches, locked doors)
- Item inventory system
- Equipment and power-ups
- Save/load system
- Particle effects
- More complex AI behaviors

## Development Mode

Enable debug visualization in `main.ts`:
```typescript
physics: {
  default: 'arcade',
  arcade: {
    debug: true  // Shows collision boxes
  }
}
```

## File Structure

- `src/main.ts` - Game configuration
- `src/scenes/` - All game scenes
- `src/entities/` - Player, enemies, items
- `assets/` - Game assets (currently using generated placeholders)

## Customization

### Change Player Speed
In `src/entities/Player.ts`, modify:
```typescript
private speed: number = 160; // Increase for faster movement
```

### Change Enemy Difficulty
In `src/entities/Enemy.ts`, modify:
```typescript
private speed: number = 80;        // Enemy movement speed
private detectionRange: number = 200; // How far they can see
private attackRange: number = 40;     // Attack distance
```

### Add More Enemies
In `src/scenes/GameScene.ts`, add to `spawnEnemies()`:
```typescript
const enemy = new Enemy(this, x, y, this.player);
this.enemies.add(enemy);
```

Have fun building your adventure! 🎮⚔️
