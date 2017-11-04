import { Group } from 'core/Group';
import { Bullet } from 'objects/Bullet';
import { Enemy } from 'core/Enemy';
import { Player } from 'objects/player/Player';
export class Room {
    public adjacentRooms: Array<Room>;
    public bullets: Group<Bullet>;
    public enemies: Group<Enemy>;
    public player: Player;

    constructor(player: Player) {
        this.player = player;
    }
}