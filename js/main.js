

function init() {
g_canvas = document.getElementById("solarCanvas");
g_stage = new createjs.Stage(g_canvas);
g_TileMap = new TileMap(200, TILE_MAP_TYPE_DOUBLE);
g_TileMap.initTokenArray();
g_TileMapView = new TileMapView(g_TileMap);
g_TileMapView.init();

SM.RegisterState( "ingame", InGameState );
SM.SetStateByName( "ingame" );
}




