
function OnEnterInGameState()
{
	$('#solarCanvasContainer,#solarDiy-panel-widget').show();
	g_canvas = document.getElementById("solarCanvas");
	g_stage = new createjs.Stage(g_canvas);
	
	initInGame(g_area, g_type);
	
	g_stage.enableDOMEvents(true);
	g_stage.enableMouseOver(10);
	
	createjs.Touch.enable(g_stage);
	createjs.Ticker.setFPS(24);
		
	createjs.Ticker.addEventListener("tick", tick);	
	
	
}

function OnExitInGameState()
{
	
}
function initInGame(area, type) {
	if (!area) {
		area = 100;
	}
	if (!type) {
		type = TILE_MAP_TYPE_DOUBLE;
	}
	g_TileMap = new TileMap(area, type);
	g_TileMap.initTokenArray();
	
	g_TileMapView = new TileMapView(g_TileMap);
	g_TileMapView.init();
	
	$('.tokenLink').click(function() {
		var id = $(this).attr('data-id');
		if (id) {
			g_TileMapView.putTokenInSelection(parseInt(id));
		} else {
			g_TileMapView.showInvertor();
		}
		 
	});
}

function tick(event) {
    g_stage.update(event); 
}


var InGameState = new State( OnEnterInGameState, OnExitInGameState );

