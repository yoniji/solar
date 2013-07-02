var preload;
var totalLoaded = 0;
var manifest;
var progressUI;
function OnEnterPreloadState()
{
	progressUI = $('#solarDiy-loadingProgress');
	g_assets = {};
	totalLoaded = 0;

	manifest = [
		{src:'./img/mixed-roof.png', id:"roof-mixed"},
		{src:'./img/pitched-roof.png', id:"roof-pitched"},
		{src:'./img/flat-roof.png', id:"roof-flat"},
		
		{src:'./img/invertor-icon.png', id:"invertor-icon"},
		{src:'./img/invertor.png', id:"invertor"},
		
		{src:'./img/token-chimney-20.png', id:"token-chimney-20"},
		{src:'./img/token-chimney-32.png', id:"token-chimney-32"},
		{src:'./img/token-chimney-50.png', id:"token-chimney-50"},
		{src:'./img/token-chimney-100.png', id:"token-chimney-100"},
		{src:'./img/token-chimney-icon.png', id:"token-chimney-icon"},
		
		{src:'./img/token-heater-20.png', id:"token-heater-20"},
		{src:'./img/token-heater-32.png', id:"token-heater-32"},
		{src:'./img/token-heater-50.png', id:"token-heater-50"},
		{src:'./img/token-heater-100.png', id:"token-heater-100"},
		{src:'./img/token-heater-icon.png', id:"token-heater-icon"},
		
		{src:'./img/token-sl-20.png', id:"token-sl-20"},
		{src:'./img/token-sl-32.png', id:"token-sl-32"},
		{src:'./img/token-sl-50.png', id:"token-sl-50"},
		{src:'./img/token-sl-100.png', id:"token-sl-100"},
		{src:'./img/token-sl-icon.png', id:"token-sl-icon"},
		
		{src:'./img/token-solar-20.png', id:"token-solar-p-20"},
		{src:'./img/token-solar-32.png', id:"token-solar-p-32"},
		{src:'./img/token-solar-50.png', id:"token-solar-p-50"},
		{src:'./img/token-solar-100.png', id:"token-solar-p-100"},
		{src:'./img/token-solar-20.png', id:"token-solar-20"},
		{src:'./img/token-solar-32.png', id:"token-solar-32"},
		{src:'./img/token-solar-50.png', id:"token-solar-50"},
		{src:'./img/token-solar-100.png', id:"token-solar-100"},
		{src:'./img/token-solar-icon.png', id:"token-solar-icon"},
		
		{src:'./img/token-window-20.png', id:"token-window-20"},
		{src:'./img/token-window-32.png', id:"token-window-32"},
		{src:'./img/token-window-50.png', id:"token-window-50"},
		{src:'./img/token-window-100.png', id:"token-window-100"},
		{src:'./img/token-window-icon.png', id:"token-window-icon"}
	];

	preload = new createjs.LoadQueue(true, "");
	
	preload.addEventListener("progress", handleProgress);
    preload.addEventListener("complete", handleComplete);
    preload.addEventListener("fileload", handleFileLoad);
    preload.addEventListener("error", handleError);

	
	preload.loadManifest(manifest);
	
	
}

function OnExitPreloadState()
{
	$('#solarDiy-loading').fadeOut();
}


function handleFileLoad(event) 
{	
	var asset = { id: event.id, src: event.src };
	g_assets[ event.id ] = asset;
}

function handleError(event) {
	console.log(event);
}

function handleProgress(event) {
		console.log(event.loaded);
		percent = Math.floor(event.loaded * 100 );
		progressUI.html(percent);
		
}

function handleComplete(event) 
{
	SM.SetStateByName( "menu" );
}


var PreloadState = new State( OnEnterPreloadState, OnExitPreloadState );
