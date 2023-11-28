//% weight=100 color=#0fbc11 icon="\uf0b2" block="GridMove"
//% groups='["Create", "Movement"]'
namespace gridmove {
    export enum Direction {
        //% block="none"
        None,
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
        _request: Direction
        
        constructor(sprite: Sprite) {
            this._sprite = sprite;
            this._speed = 100
            this._playerControl = false
            this._request = Direction.None
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
            } else if (controller.down.isPressed()) {
                this._request = Direction.Down
            } else if (controller.left.isPressed()) {
                this._request = Direction.Left
            } else if (controller.right.isPressed()) {
                this._request = Direction.Right
            }
        }

        private updateMovement() {
            const maxPixel = 2
            const tileSize = 16

            let x = this._sprite.x
            let y = this._sprite.y
            let vx = this._sprite.vx
            let vy = this._sprite.vy

            const ix = Math.round(x / maxPixel) * maxPixel
            const iy = Math.round(y / maxPixel) * maxPixel

            const cx = tileSize / 2 + Math.round((ix - tileSize / 2) / tileSize) * tileSize
            const cy = tileSize / 2 + Math.round((iy - tileSize / 2) / tileSize) * tileSize

            if (vx == 0) {
                if (this._request == Direction.Down) {
                    x = cx
                    vx = 0
                    vy = this._speed
                } else if (this._request == Direction.Up) {
                    x = cx
                    vx = 0
                    vy = -this._speed
                } else if (ix == cx) {
                    x = cx
                    y = cy
                    vx = 0
                    vy = 0
                }
            }
            if (vy == 0) {
                if (this._request == Direction.Right) {
                    y = cy
                    vx = this._speed
                    vy = 0
                } else if (this._request == Direction.Left) {
                    y = cy
                    vx = -this._speed
                    vy = 0
                } else if (ix == cx) {
                    x = cx
                    y = cy
                    vx = 0
                    vy = 0
                }
            }
            if (vx == 0 && vy == 0) {
                // Stopped, ensure centralised in square
                x = cx
                y = cy
            }

            // copy back out to sprite
            this._sprite.x = x
            this._sprite.y = y
            this._sprite.vx = vx
            this._sprite.vy = vy
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
