namespace SpriteKind {
    export const Pill = SpriteKind.create()
}
function makePills () {
    pillCount = 0
    for (let value of tiles.getTilesByType(assets.tile`floorPill`)) {
        tiles.placeOnTile(sprites.create(assets.image`pill`, SpriteKind.Pill), value)
        pillCount += 1
        tiles.setTileAt(value, assets.tile`floorPill`)
    }
}
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
    tiles.placeOnTile(heroSprite, tiles.getTilesByType(assets.tile`floorHome`)[0])
}
function MakeWalls () {
    for (let value of tiles.getTilesByType(assets.tile`wall`)) {
        tiles.setWallAt(value, true)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pill, function (sprite, otherSprite) {
    music.play(music.createSoundEffect(WaveShape.Sine, 1, 5000, 255, 110, 50, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    info.changeScoreBy(10)
    sprites.destroy(otherSprite)
    pillCount += -1
    if (pillCount == 0) {
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
        info.changeScoreBy(1000)
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
    heroMover.speed(100)
    heroMover.playerControl(true)
    heroMover.autoStop(false)
    heroMover.turnStop(true)
}
let heroMover: gridmove.Mover = null
let heroSprite: Sprite = null
let pillCount = 0
let levels: tiles.TileMapData[] = []
levels.push(tilemap`level8`)
levels.push(tilemap`level1`)
MakeHero()
NextLevel()
