import {Body} from './Body';
import {CollisionDetector} from './CollisionDetector';
import {CollisionSolver} from './CollisionSolver';

export class World {
  protected updateRate: number = 1 / 60;
  protected time: number = 0;
  protected overTime: number = 0;
  protected bodies: Set<Body> = new Set;
  protected collisionDetector: CollisionDetector;
  protected collisionSolver: CollisionSolver;
  protected colliders: Map<Body, Set<Body>> = new Map;

  constructor() {
    this.collisionDetector = new CollisionDetector();
    this.collisionSolver = new CollisionSolver();
  }

  public update(timeEllapsed: number) {
    let t = 0;
    while (t < timeEllapsed - this.overTime) {
      t += this.updateRate;
      for (const body of this.bodies.values()) {
        body.velocity = Phaser.Point.multiplyAdd(body.velocity, body.acceleration, this.updateRate);
        body.position = Phaser.Point.multiplyAdd(body.position, body.velocity, this.updateRate);
      }
      for (const body of this.bodies.values()) {
        if (this.colliders.has(body)) {
          for (const collider of this.colliders.get(body).values()) {
            
          }
        }
      }

    }
    this.overTime = t - timeEllapsed;
  }

  public add(shape: Phaser.Point[], x: number = 0, y: number = 0) {
    const body = this.make(shape, x, y);
    this.bodies.add(body);
    return body;
  }

  public make(shape: Phaser.Point[], x: number = 0, y: number = 0) {
    const body = new Body(shape, x, y);
    return body;
  }

  public addCollider(body: Body, bodyWith: Body) {
    if (!this.colliders.has(body)) {
      this.colliders.set(body, new Set);
    }
    this.colliders.get(body).add(bodyWith);
  }
}
