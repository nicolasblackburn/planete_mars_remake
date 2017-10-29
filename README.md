# Planete Mars

This is a port to Phaser of the old unfinished game I did.

## Issues / To-dos

- Mechanism to make virtual rooms in one tilemap
- Fix keyboards input cannot shoot maximum bullets
- Bullets should go into a pool to be reused once they killed a target or they've been removed from the map
- Keep a list of spawn points for the enemies
- When a spawn point enters the camera and it's enemy is not spawned, it spawns an enemy
- When game entities (bullets, enemies, etc.) are not in the camera, they should not be updated
- Add crab ai to allow it to move in random directions
- Player can be hurt and lose a life after reaching 0 'énergie'
- When the player dies, he goes back to the latest checkpoint
- When hurt, the player is blinking and invincible for a small amount of time
- Create a screen to change the keyboard inputs
- Save progress (latest checkpoint, inventory and player status) in local storage
- Create a screen to create new game / continue saved game
