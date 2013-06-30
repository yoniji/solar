
function OnEnterInGameState()
{	
	g_stage.enableDOMEvents(true);
	g_stage.enableMouseOver(10);
	
	createjs.Touch.enable(g_stage);
	createjs.Ticker.setFPS(24);
	createjs.Ticker.addEventListener("tick", tick);	
}

function OnExitInGameState()
{
	
}
function handleClick(event) {
     console.log("Method called in scope: " + this);
}

function tick(event) {
    g_stage.update(event); 
}


var InGameState = new State( OnEnterInGameState, OnExitInGameState );

