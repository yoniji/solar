

function init() {
SM.RegisterState( "menu", MenuState );
SM.RegisterState( "preload", PreloadState );
SM.RegisterState( "ingame", InGameState );
SM.SetStateByName( "preload" );
}




