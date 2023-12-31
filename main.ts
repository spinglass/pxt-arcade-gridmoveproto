namespace SpriteKind {
    export const Pill = SpriteKind.create()
    export const Fruit = SpriteKind.create()
}
function resetPositions () {
    heroMover.place(tiles.getTilesByType(assets.tile`floorHome`)[0])
    enemyMover.place(tiles.getTilesByType(assets.tile`floorEnemy`)[0])
}
function updateEnemy () {
    dx = heroMover.x - enemyMover.x
    dy = heroMover.y - enemyMover.y
    if (Math.abs(dx) > Math.abs(dy)) {
        if (enemyMover.vx == 0) {
            if (dx < 0) {
                enemyMover.setRequest(gridmove.Direction.Left)
            } else {
                enemyMover.setRequest(gridmove.Direction.Right)
            }
        }
    } else {
        if (enemyMover.vy == 0) {
            if (dy < 0) {
                enemyMover.setRequest(gridmove.Direction.Up)
            } else {
                enemyMover.setRequest(gridmove.Direction.Down)
            }
        }
    }
}
function makePills () {
    pillCount = 0
    for (let value of tiles.getTilesByType(assets.tile`floorPill`)) {
        tiles.placeOnTile(sprites.create(assets.image`pill`, SpriteKind.Pill), value)
        pillCount += 1
        tiles.setTileAt(value, assets.tile`floorPill`)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Fruit, function (sprite, otherSprite) {
    destroyFruit()
    info.stopCountdown()
    info.changeScoreBy(1000)
    effects.confetti.startScreenEffect()
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    effects.confetti.endScreenEffect()
})
function destroyFruit () {
    events.cancelEvent("fruit_despawn")
    sprites.destroy(fruitSprite)
    effects.confetti.endScreenEffect()
}
function makeFruit (spawnTime: number, despawnTime: number) {
    events.sendEvent("fruit_spawn", spawnTime)
    fruitDespawnTime = despawnTime
}
events.onEvent("start", function () {
    heroMover.setFreeze(false)
    enemyMover.setFreeze(false)
})
events.onEvent("fruit_despawn", function () {
    destroyFruit()
    music.play(music.createSoundEffect(WaveShape.Sine, 5000, 1052, 255, 255, 250, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
})
function NextLevel () {
    destroyEnemy()
    level += 1
    if (level == 1) {
        tiles.setCurrentTilemap(tilemap`level0`)
        makeFruit(5, 5)
        makeEnemy()
    } else if (level == 2) {
        tiles.setCurrentTilemap(tilemap`level6`)
        makeFruit(10, 10)
        makeEnemy()
    } else {
        game.gameOver(true)
    }
    MakeLevel()
}
function MakeLevel () {
    MakeWalls()
    makePills()
    resetPositions()
}
function destroyEnemy () {
    if (enemyMover) {
        enemyMover.destroy()
    }
}
function MakeWalls () {
    for (let value2 of tiles.getTilesByType(assets.tile`wall`)) {
        tiles.setWallAt(value2, true)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pill, function (sprite, otherSprite) {
    music.play(music.createSoundEffect(WaveShape.Sine, 1, 5000, 120, 0, 50, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    info.changeScoreBy(10)
    sprites.destroy(otherSprite)
    pillCount += -1
    if (pillCount == 0) {
        heroMover.setFreeze(true)
        enemyMover.setFreeze(true)
        events.cancelAllEvents()
        info.changeScoreBy(1000)
        music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
        NextLevel()
    }
})
function MakeHero () {
    heroMover = gridmove.create(img`
        . . . . . . 5 . 5 . . . . . . . 
        . . . . . f 5 5 5 f f . . . . . 
        . . . . f 1 5 2 5 1 6 f . . . . 
        . . . f 1 6 6 6 6 6 1 6 f . . . 
        . . . f 6 6 f f f f 6 1 f . . . 
        . . . f 6 f f d d f f 6 f . . . 
        . . f 6 f d f d d f d f 6 f . . 
        . . f 6 f d 3 d d 3 d f 6 f . . 
        . . f 6 6 f d d d d f 6 6 f . . 
        . f 6 6 f 3 f f f f 3 f 6 6 f . 
        . . f f d 3 5 3 3 5 3 d f f . . 
        . . f d d f 3 5 5 3 f d d f . . 
        . . . f f 3 3 3 3 3 3 f f . . . 
        . . . f 3 3 5 3 3 5 3 3 f . . . 
        . . . f f f f f f f f f f . . . 
        . . . . . f f . . f f . . . . . 
        `, SpriteKind.Player)
    heroMover.cameraFollow()
    heroMover.setSpeed(60)
    heroMover.setPlayerControl(true)
    heroMover.setMode(gridmove.Mode.Continuous)
}
function makeEnemy () {
    enemyMover = gridmove.create(img`
        ........................
        ........................
        ........................
        ........................
        ..........ffff..........
        ........ff1111ff........
        .......fb111111bf.......
        .......f11111111f.......
        ......fd11111111df......
        ......fd11111111df......
        ......fddd1111dddf......
        ......fbdbfddfbdbf......
        ......fcdcf11fcdcf......
        .......fb111111bf.......
        ......fffcdb1bdffff.....
        ....fc111cbfbfc111cf....
        ....f1b1b1ffff1b1b1f....
        ....fbfbffffffbfbfbf....
        .........ffffff.........
        ...........fff..........
        ........................
        ........................
        ........................
        ........................
        `, SpriteKind.Enemy)
    enemyMover.setMode(gridmove.Mode.Continuous)
    enemyMover.setSpeed(60)
}
events.onEvent("fruit_spawn", function () {
    fruitSprite = sprites.create(img`
        . . . . . . . . . . . 6 6 6 6 6 
        . . . . . . . . . 6 6 7 7 7 7 8 
        . . . . . . 8 8 8 7 7 8 8 6 8 8 
        . . e e e e c 6 6 8 8 . 8 7 8 . 
        . e 2 5 4 2 e c 8 . . . 6 7 8 . 
        e 2 4 2 2 2 2 2 c . . . 6 7 8 . 
        e 2 2 2 2 2 2 2 c . . . 8 6 8 . 
        e 2 e e 2 2 2 2 e e e e c 6 8 . 
        c 2 e e 2 2 2 2 e 2 5 4 2 c 8 . 
        . c 2 e e e 2 e 2 4 2 2 2 2 c . 
        . . c 2 2 2 e e 2 2 2 2 2 2 2 e 
        . . . e c c e c 2 2 2 2 2 2 2 e 
        . . . . . . . c 2 e e 2 2 e 2 c 
        . . . . . . . c e e e e e e 2 c 
        . . . . . . . . c e 2 2 2 2 c . 
        . . . . . . . . . c c c c c . . 
        `, SpriteKind.Fruit)
    tiles.placeOnTile(fruitSprite, tiles.getTilesByType(assets.tile`floorFruit`)[0])
    music.play(music.createSoundEffect(WaveShape.Sine, 1188, 5000, 255, 255, 250, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    events.sendEvent("fruit_despawn", fruitDespawnTime)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    resetPositions()
    heroMover.setFreeze(true)
    enemyMover.setFreeze(true)
    info.changeLifeBy(-1)
    events.sendEvent("start", 1)
})
let level = 0
let fruitDespawnTime = 0
let fruitSprite: Sprite = null
let pillCount = 0
let dy = 0
let dx = 0
let enemyMover: gridmove.Mover = null
let heroMover: gridmove.Mover = null
game.splash("Welcome to Pac Girl")
info.setScore(0)
info.setLife(3)
MakeHero()
NextLevel()
game.onUpdate(function () {
    updateEnemy()
})
