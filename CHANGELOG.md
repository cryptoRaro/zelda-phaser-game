# Changelog

## Version 1.1 - WASD Controls Update

### Changed
- **Movement Controls**: Changed from Arrow Keys to WASD
  - W = Move Up
  - A = Move Left  
  - S = Move Down
  - D = Move Right

### Files Modified
1. `src/entities/Player.ts`
   - Replaced arrow key cursors with WASD key bindings
   - Updated `handleMovement()` method to use W/A/S/D keys
   - Changed property from `cursors` to `keys` for clarity

2. `src/scenes/MainMenuScene.ts`
   - Updated instructions text to show "WASD: Move"

3. `src/scenes/UIScene.ts`
   - Updated controls reminder to show "WASD: Move"

4. `README.md`
   - Updated controls section

5. `QUICKSTART.md`
   - Updated controls section

6. `PROJECT_OVERVIEW.md`
   - Updated feature list

### Technical Details

**Before:**
```typescript
private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
this.cursors = scene.input.keyboard!.createCursorKeys();

if (this.cursors.left.isDown) { ... }
if (this.cursors.right.isDown) { ... }
if (this.cursors.up.isDown) { ... }
if (this.cursors.down.isDown) { ... }
```

**After:**
```typescript
private keys!: {
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
};
this.keys = {
  w: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
  a: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
  s: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
  d: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
};

if (this.keys.a.isDown) { ... }
if (this.keys.d.isDown) { ... }
if (this.keys.w.isDown) { ... }
if (this.keys.s.isDown) { ... }
```

### Why WASD?
- More comfortable for many PC gamers
- Allows right hand on mouse (for future features)
- Standard for most PC action games
- Leaves arrow keys available for potential second player or alternative control scheme

### Unchanged
- Space Bar: Attack
- E Key: Interact
- All other game mechanics remain the same

---

## Version 1.0 - Initial Release

### Features
- Player character with movement and combat
- Enemy AI with state machines
- Health system
- Interactable chests
- UI with health bar and item counters
- Dungeon with walls and obstacles
