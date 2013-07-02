
function OnEnterInGameState()
{
	$('#solarDiy').show();
	$('#solarCanvasContainer,#solarDiy-panel-widget').fadeIn('fast');
	
	g_canvas = document.getElementById("solarCanvas");
	g_stage = new createjs.Stage(g_canvas);
	
	initInGame();
	
	g_stage.enableDOMEvents(true);
	g_stage.enableMouseOver(10);
	
	createjs.Touch.enable(g_stage);
	createjs.Ticker.setFPS(24);
		
	createjs.Ticker.addEventListener("tick", tick);	
	

}

function OnExitInGameState()
{
	
}
function initInGame() {

	if (g_isReadFromConfig) {
		g_area = g_config.area;
		g_type = g_config.type;
	}
	
	if (!g_area) {
		g_area = 100;
		g_isReadFromConfig = false;
	}
	if (!g_type) {
		g_type = TILE_MAP_TYPE_FLAT;
		g_isReadFromConfig = false;
	}
	
	if ( g_area < 50 ) {
		g_area = 50;
	}
	if ( g_area > 300 ) {
		g_area = 300;
	}
	
	g_TileMap = new TileMap(g_area, g_type);
	g_TileMap.initTokenArray();
	
	g_TileMapView = new TileMapView(g_TileMap);
	g_TileMapView.init();
	//g_stage.update();
	
	if ( g_isReadFromConfig ) {
		g_TileMap.loadFromConfig(g_config);
		
		g_TileMapView._drawTokens();
	}
	
	
	$('.tokenLink').click(function() {
		var id = $(this).attr('data-id');
		if (id) {
			g_TileMapView.putTokenInSelection(parseInt(id));
		} else {
			g_TileMapView.showInvertor();
		}
		 
	});
	
	$('#diy-switcher a').bind('click', function() {
		g_TileMap.exportConfig();
	});
	
	
}

function tick(event) {
    g_stage.update(event); 
}


var InGameState = new State( OnEnterInGameState, OnExitInGameState );

