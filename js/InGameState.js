
function OnEnterInGameState()
{
	$('#solarDiy').show();
	$('#solarCanvasContainer,#solarDiy-panel-widget').show();
	
	g_canvas = document.getElementById("solarCanvas");
	g_stage = new createjs.Stage(g_canvas);
	
	var txt = new createjs.Text("正在生成DIY画面...", "18px Sans-serif","#FFFFFF");
	txt.textAlign = "center";
	txt.x =  g_canvas.width / 2;
	txt.y =  g_canvas.height / 2;

	g_stage.addChild(txt);
	
	createjs.Ticker.addEventListener("tick", tick);	
	
	
	initInGame();
	txt.alpha = 0;
	
	createjs.Touch.enable(g_stage);
	createjs.Ticker.setFPS(24);
		
	
	

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
		
		
		if ( g_TileMap.exportConfig() ) {
			$(this).unbind();
			$('.tokenLink').unbind();
			createjs.Touch.disable(g_stage)
			
			g_TileMapView.showSun();
		}			
		
	});
	
	
}

function tick(event) {
    g_stage.update(event); 
}
function animationTick(event) {
	g_TileMapView.updateAnimation();
	 g_stage.update(event); 
}

var InGameState = new State( OnEnterInGameState, OnExitInGameState );

