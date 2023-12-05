// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level0":
            case "level8":return tiles.createTilemap(hex`0a00070001010101010101010101010202020202020202010102010101010201020101020202020204010201010201010101020102010103020202020202020101010101010101010101`, img`
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
. . . . . . . . . . 
`, [myTiles.transparency16,myTiles.tile2,myTiles.tile1,myTiles.tile3,myTiles.tile4], TileScale.Sixteen);
            case "level6":
            case "level1":return tiles.createTilemap(hex`1000100002020202020202020202020202020202020101010101010101010101010101020201020102020202020202020102010202010201010101010101010101020102020102010202020102020202010201020201010101010101010101010101010202010201020102020102010201020102020102010201010301020102010201020201020102010201040101020102010202010201020102010202010201020102020101010101010101010101010101020201020102020202010202020102010202010201010101010101010101020102020102010202020202020202010201020201010101010101010101010101010202020202020202020202020202020202`, img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`, [myTiles.transparency16,myTiles.tile1,myTiles.tile2,myTiles.tile3,myTiles.tile4], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "wall":
            case "tile2":return tile2;
            case "floorPill":
            case "tile1":return tile1;
            case "floorHome":
            case "tile3":return tile3;
            case "floorFruit":
            case "tile4":return tile4;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
