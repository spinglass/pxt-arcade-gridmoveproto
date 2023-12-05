//% weight=100 color=#0fbc11 icon="\uf0b2" block="GridMove"
//% groups='["Create", "Movement"]'
namespace gridmove {
    export enum Direction {
        //% block="none"
        None,
        //% block="stop"
        Stop,
        //% block="up"
        Up,
        //% block="down"
        Down,
        //% block="left"
        Left,
        //% block="right"
        Right,
    }

    class MoverManager {
        _movers: Mover[]

        constructor() {
            this._movers = []
        }

        public init() {
            game.onUpdate(function () {
                const mm = getMoverManager()
                mm._movers.forEach(mover => mover.update())
            })
        }

        public createMover(sprite: Sprite) : Mover
        {
            const mover = new Mover(sprite)
            this._movers.push(mover)
            return mover
        }
    }

    export class Mover {
        _sprite: Sprite
        _speed: number
        _playerControl: boolean
        _autoStop: boolean
        _turnStop: boolean
        _request: Direction
        _x: number
        _y: number
        _loc: tiles.Location
        
        constructor(sprite: Sprite) {
            this._sprite = sprite;
            this._speed = 100
            this._playerControl = false
            this._autoStop = false
            this._turnStop = false
            this._request = Direction.None
            this._x = sprite.x
            this._y = sprite.y
        }

        public update() {
            this.updateMovement()
            this.updatePlayerControl()
        }

        private updatePlayerControl() {
            if (!this._playerControl) {
                return
            }

            this._request = Direction.None
            
            if (controller.up.isPressed()) {
                this._request = Direction.Up
            }
            if (controller.down.isPressed()) {
                this._request = Direction.Down
            }
            if (controller.left.isPressed()) {
                this._request = Direction.Left
            }
            if (controller.right.isPressed()) {
                this._request = Direction.Right
            }
        }

        private canMove(direction: CollisionDirection): boolean {
            if (this._turnStop)
            {
                // Can't move in requested direction if there's a wall there
                const neighbor = this._loc.getNeighboringLocation(direction)
                if (neighbor)
                {
                    return !neighbor.isWall()
                }
            }
            return true
        }

        private updateMovement() {
            const tileSize = 16

            const x = this._sprite.x
            const y = this._sprite.y
            const vx = this._sprite.vx
            const vy = this._sprite.vy
            const lx = this._x
            const ly = this._y

            // Get the current tile
            this._loc = this._sprite.tilemapLocation()
            const tx = this._loc.x
            const ty = this._loc.y

            // are we at mid point of the tile
            let midx = true
            let midy = true
            if (vx > 0) {
                midx = (lx < tx && x >= tx) // crossing tx
            } else if (vx < 0) {
                midx = (lx > tx && x <= tx) // crossing tx
            } else if (vy > 0) {
                midy = (ly < ty && y >= ty) // crossing ty
            } else if (vy < 0) {
                midy = (ly > ty && y <= ty) // crossing ty
            }

            const canStop = this._autoStop || (this._request == Direction.Stop)

            // moving in x or middle of y
            if (vx != 0 || midy) {
                if (this._request == Direction.Right && this.canMove(CollisionDirection.Right)) {
                    this._sprite.vx = this._speed
                    this._sprite.vy = 0
                } if (this._request == Direction.Left && this.canMove(CollisionDirection.Left)) {
                    this._sprite.vx = -this._speed
                    this._sprite.vy = 0
                } else if (canStop && vx != 0 && midx) {
                    this._sprite.vx = 0
                    this._sprite.vy = 0
                }
            }
            // moving in y or middle of x
            if (vy != 0 || midx) {
                if (this._request == Direction.Up && this.canMove(CollisionDirection.Top)) {
                    this._sprite.vx = 0
                    this._sprite.vy = -this._speed
                } else if (this._request == Direction.Down && this.canMove(CollisionDirection.Bottom)) {
                    this._sprite.vx = 0
                    this._sprite.vy = this._speed
                } else if (canStop && vy != 0 && midy) {
                    this._sprite.vx = 0
                    this._sprite.vy = 0
                }
            }

            // ensure centered in non-moving direction(s)
            if (this._sprite.vx == 0) {
                this._sprite.x = tx
            }
            if (this._sprite.vy == 0) {
                this._sprite.y = ty
            }

            this._x = this._sprite.x
            this._y = this._sprite.y
        }
        
        //% group="Movement"
        //% block="set $this speed to $speed"
        //% this.defl=myMover
        public speed(speed: number = 100) {
            this._speed = speed
        }

        //% group="Movement"
        //% block="set $this player control $enable"
        //% this.defl=myMover
        public playerControl(enable: boolean = true) {
            this._playerControl = enable
        }

        //% group="Movement"
        //% block="set $this auto-stop $enable"
        //% this.defl=myMover
        public autoStop(enable: boolean = true) {
            this._autoStop = enable
        }

        //% group="Movement"
        //% block="set $this turn-stop $enable"
        //% this.defl=myMover
        public turnStop(enable: boolean = true) {
            this._turnStop = enable
        }
     }

    //% group="Create"
    //% block="mover for sprite $sprite"
    //% blockSetVariable=myMover
    export function create(sprite: Sprite): Mover {
        const mm = getMoverManager()
        return mm.createMover(sprite)
    }

    function getMoverManager(): MoverManager {
        let mm = game.currentScene().data.moverManager
        if (!mm) {
            mm = new MoverManager()
            mm.init()
            game.currentScene().data.moverManager = mm
        }
        return mm
    }
}
