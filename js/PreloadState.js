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
		{src:'./img/mixed-roof.png', id:"mixed-roof"},
		{src:'./img/pitched-roof.png', id:"pitched-roof"},
		{src:'./img/flat-roof.png', id:"flat-roof"},
		{src:'./img/mixed-roof-icon.png', id:"mixed-roof-icon"},
		{src:'./img/pitched-roof-icon.png', id:"pitched-roof-icon"},
		{src:'./img/flat-roof-icon.png', id:"flat-roof-icon"},
		
		{src:'./img/diy-sun.png', id:"sun"},
		{src:'./img/diy-sunlight.png', id:"sunlight"},
		
		{src:'./img/line-mixed.png', id:"line-mixed"},
		{src:'./img/line-piched.png', id:"line-pitched"},
		{src:'./img/line-flat.png', id:"line-flat"},
		
		{src:'./img/invertor-icon.png', id:"invertor-icon"},
		{src:'./img/invertor.png', id:"invertor"},
		{src:'./img/invertor-flat.png', id:"invertor-flat"},
		
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
		
		{src:'./img/token-solar-p-20.png', id:"token-solar-p-20"},
		{src:'./img/token-solar-p-32.png', id:"token-solar-p-32"},
		{src:'./img/token-solar-p-50.png', id:"token-solar-p-50"},
		{src:'./img/token-solar-p-100.png', id:"token-solar-p-100"},
		{src:'./img/token-solar-20.png', id:"token-solar-20"},
		{src:'./img/token-solar-32.png', id:"token-solar-32"},
		{src:'./img/token-solar-50.png', id:"token-solar-50"},
		{src:'./img/token-solar-100.png', id:"token-solar-100"},
		{src:'./img/token-solar-icon.png', id:"token-solar-icon"},
		
		{src:'./img/token-window-20.png', id:"token-window-20"},
		{src:'./img/token-window-32.png', id:"token-window-32"},
		{src:'./img/token-window-50.png', id:"token-window-50"},
		{src:'./img/token-window-100.png', id:"token-window-100"},
		{src:'./img/token-window-flat-20.png', id:"token-window-flat-20"},
		{src:'./img/token-window-flat-32.png', id:"token-window-flat-32"},
		{src:'./img/token-window-flat-50.png', id:"token-window-flat-50"},
		{src:'./img/token-window-flat-100.png', id:"token-window-flat-100"},
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
	$('#solarDiyClose').bind('click',function() {
		var r=confirm('您的DIY结果还没有保存，确认关闭么');
		if (r) {
			$('#solarDiyContainer').fadeOut();
			resetGlobal();
		}
	});
}


function handleFileLoad(event) 
{	
	var asset = { id: event.item.id, img: event.result };
	g_assets[ event.item.id ] = asset;
}

function handleError(event) {
	console.log(event);
}

function handleProgress(event) {
		percent = Math.floor(event.loaded * 100 );
		progressUI.html(percent);
		
}

function handleComplete(event) 
{
	if ( g_isReadFromConfig ) {
		SM.SetStateByName( "ingame" );
	} else {
		SM.SetStateByName( "input" );
	}
	
}


var PreloadState = new State( OnEnterPreloadState, OnExitPreloadState );
