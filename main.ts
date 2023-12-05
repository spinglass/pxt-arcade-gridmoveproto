function makePills () {
    pillCount = 0
    for (let value of tiles.getTilesByType(assets.tile`myTile`)) {
        tiles.placeOnTile(sprites.create(assets.image`pill`, SpriteKind.Food), value)
        pillCount += 1
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    music.play(music.createSoundEffect(WaveShape.Sine, 1, 5000, 255, 110, 50, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
    sprites.destroy(otherSprite)
    pillCount += -1
    if (pillCount == 0) {
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.UntilDone)
    }
})
function MakeWalls () {
    for (let value of tiles.getTilesByType(assets.tile`myTile0`)) {
        tiles.setWallAt(value, true)
    }
}
function MakeHero () {
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
tiles.setCurrentTilemap(tilemap`level1`)
MakeWalls()
makePills()
MakeHero()
