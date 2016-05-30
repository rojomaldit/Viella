var file;
var fullPath;
var media;

function onBodyLoad(){
	document.addEventListener("deviceready",onDeviceReady,false);
}

function onDeviceReady(){
	//Dispositivo Listo
}


function reproducirAudioGrabado(){
    if (typeof file === "undefined") {
    	navigator.notification.alert("Primero debe grabar un Audio.", null, "Mensaje en Reproducir", "Aceptar");
		return; 
    }
    else if(Media.MEDIA_NONE == 0){
        media = new Media(file, function(e) {  //solo crear objeto cuando no grabé ningún sonido
        media.release();
        }, function(err) {
        console.log("media err", err);
        });
    }

    media.play();
}

function pausarAudio(){
    media.pause();
}

function pararAudio(){
    media.stop();
}

function Sonido(){
	if( window.plugins && window.plugins.NativeAudio ) {
	
	// Preload audio resources 
	window.plugins.NativeAudio.preloadComplex( 'guitar', 'audio/guitar.wav', 1, 1, 0, function(msg){
	}, function(msg){
		console.log( 'error: ' + msg );
	});
	
	window.plugins.NativeAudio.preloadComplex( 'guitar', 'audio/electro.wav', 1, 1, 0, function(msg){
	}, function(msg){
		console.log( 'error: ' + msg );
	});
 
 
	// Play 
	window.plugins.NativeAudio.loop( 'electro' );
	window.plugins.NativeAudio.loop( 'guitar' );
 
 
	// Stop multichannel clip after 20 seconds 
	window.setTimeout( function(){
 
		window.plugins.NativeAudio.stop( 'electro' );
			
		window.plugins.NativeAudio.unload( 'guitar' );
		window.plugins.NativeAudio.unload( 'electro' );
 
	}, 1000 * 20 );
}
}
