namespace SpriteKind {
    export const Pill = SpriteKind.create()
    export const Fruit = SpriteKind.create()
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
function makeFruit () {
    destroyFruit()
    events.sendEvent("fruit_spawn", fruitSpawnTimes.shift())
    fruitDespawnTime = fruitDesawnTimes.shift()
}
events.onEvent("fruit_despawn", function () {
    destroyFruit()
    music.play(music.createSoundEffect(WaveShape.Sine, 5000, 1052, 255, 255, 250, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
})
function NextLevel () {
    if (levels.length > 0) {
        MakeLevel()
    } else {
        game.gameOver(true)
    }
}
function MakeLevel () {
    tiles.setCurrentTilemap(levels.shift())
    MakeWalls()
    makePills()
    makeFruit()
    heroSprite.setVelocity(0, 0)
    tiles.placeOnTile(heroSprite, tiles.getTilesByType(assets.tile`floorHome`)[0])
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
        heroSprite.setVelocity(0, 0)
        events.cancelAllEvents()
        info.changeScoreBy(1000)
        music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.UntilDone)
        NextLevel()
    }
})
function MakeHero () {
    info.setScore(0)
    heroSprite = sprites.create(img`
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
    tiles.placeOnTile(heroSprite, tiles.getTileLocation(1, 1))
    scene.cameraFollowSprite(heroSprite)
    heroMover = gridmove.create(heroSprite)
    heroMover.setSpeed(100)
    heroMover.setPlayerControl(true)
    heroMover.setMode(gridmove.Mode.Continuous)
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
let heroMover: gridmove.Mover = null
let heroSprite: Sprite = null
let fruitDespawnTime = 0
let fruitSprite: Sprite = null
let pillCount = 0
let fruitDesawnTimes: number[] = []
let fruitSpawnTimes: number[] = []
let levels: tiles.TileMapData[] = []
levels.push(tilemap`level0`)
levels.push(tilemap`level6`)
fruitSpawnTimes = [5, 10]
fruitDesawnTimes = [5, 10]
game.splash("Welcome to Pac Girl")
MakeHero()
NextLevel()
